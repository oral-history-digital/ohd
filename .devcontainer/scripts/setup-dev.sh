#!/usr/bin/env bash
set -euo pipefail

# ── Logging ───────────────────────────────────────────────────────────────────
LOGDIR="/workspace/.devcontainer/logs"
mkdir -p "$LOGDIR"
exec > >(tee -a "$LOGDIR/setup.log") 2> >(tee -a "$LOGDIR/setup_errors.log" >&2)

log()   { echo "[$(date '+%H:%M:%S')] $*"; }
log_e() { echo "[$(date '+%H:%M:%S')] ERROR: $*" >&2; }

log "postCreateCommand starting…"

# ── Config files ──────────────────────────────────────────────────────────────
log "Copying config files…"
[[ ! -f config/database.yml ]] && cp .devcontainer/config/database.yml config/database.yml && log "  ✓ config/database.yml"
[[ ! -f config/datacite.yml ]] && cp config/datacite.example.yml config/datacite.yml       && log "  ✓ config/datacite.yml"
# Always overwrite – devcontainer must point at the solr container
cp .devcontainer/config/sunspot.yml config/sunspot.yml
log "  ✓ config/sunspot.yml"

# ── Dependencies ──────────────────────────────────────────────────────────────
log "Installing gems…"
bundle check > /dev/null 2>&1 || bundle install --quiet
log "  ✓ gems ready"

log "Installing JS packages…"
yarn install --frozen-lockfile
log "  ✓ JS packages ready"

# ── Wait for Solr default core ────────────────────────────────────────────────
log "Waiting for Solr default core…"
for i in $(seq 1 24); do
  if curl -sf "http://solr:8983/solr/default/admin/ping?wt=json" 2>/dev/null | grep -q '"status":"OK"'; then
    log "  ✓ Solr core ready"; break
  fi
  [[ $i -eq 24 ]] && log "  ⚠ Solr core not ready after 120 s – continuing anyway" && break
  sleep 5
done

# ── Database ──────────────────────────────────────────────────────────────────
DUMP_PATH=".devcontainer/db/dump.sql.gz"
TABLE_COUNT=$(mysql -h db -u root -prootpassword -s -N \
  -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='ohd_development';" 2>/dev/null || echo 0)

if [[ "$TABLE_COUNT" -gt 0 ]]; then
  log "Database exists ($TABLE_COUNT tables) – running pending migrations…"
  RAILS_ENV=development RAILS_LOG_LEVEL=error bundle exec rails db:migrate
  log "  ✓ migrations done"
  log "  ℹ To reimport the dump from scratch: bin/rake database:reimport"
elif [[ -f "$DUMP_PATH" ]]; then
  log "Importing database dump from $DUMP_PATH…"
  mysql -h db -u root -prootpassword \
    -e "DROP DATABASE IF EXISTS ohd_development; CREATE DATABASE ohd_development CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  gunzip < "$DUMP_PATH" | mysql -h db -u root -prootpassword ohd_development
  log "  ✓ dump imported – running migrations…"
  RAILS_ENV=development RAILS_LOG_LEVEL=error bundle exec rails db:migrate
  log "  ✓ migrations done"
else
  log "No existing database and no dump found – running db:setup + db:seed…"
  RAILS_LOG_LEVEL=error bundle exec rake db:setup
  RAILS_ENV=development RAILS_LOG_LEVEL=error bundle exec rails db:seed
  log "  ✓ database ready"
fi

# ── Project domain ────────────────────────────────────────────────────────────
log "Configuring project domains…"
RAILS_LOG_LEVEL=error bundle exec rails runner '
  Project.ohd.update(archive_domain: "http://portal.oral-history.localhost:3000")
  Project.where.not(id: Project.ohd.id).update_all(archive_domain: nil)
' && log "  ✓ domains configured" \
  || log_e "Domain config failed – run manually if needed:
     bundle exec rails runner 'Project.ohd.update(archive_domain: \"http://portal.oral-history.localhost:3000\")'"

# ── Webpack ───────────────────────────────────────────────────────────────────
log "Precompiling webpack assets (first-run manifest)…"
bundle exec bin/shakapacker
log "  ✓ webpack done"

log "postCreateCommand complete ✓"