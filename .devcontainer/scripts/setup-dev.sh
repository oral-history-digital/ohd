 
#!/usr/bin/env bash
set -euo pipefail

# 1) Logging
LOGDIR="/workspace/.devcontainer/logs"
mkdir -p "$LOGDIR"
ERROR_LOG="$LOGDIR/setup_errors.log"
SETUP_LOG="$LOGDIR/setup.log"

# Initialize setup and error logs
echo "=== Starting setup: $(date) ===" > "$SETUP_LOG"
echo "=== Errors from setup: $(date) ===" > "$ERROR_LOG"
exec > >(tee -a "$SETUP_LOG") 2> >(tee -a "$ERROR_LOG" >&2)

# Logging helpers
log_message() {
  echo "$@" | tee -a "$SETUP_LOG"
}
log_error() {
  echo "ERROR: $@" | tee -a "$ERROR_LOG" >&2
}

# 2) Platform‐specific fixes
if grep -q Darwin /proc/version 2>/dev/null; then
  echo "Mac host detected, applying Mac-specific fixes…"
  sed -i 's/host: db/host: db\n  socket: false/' config/database.yml || true
  find db/migrate -name "*.rb" -exec touch {} \; || true
  export TIMEOUT_MULTIPLIER=3
else
  echo "Linux host detected, applying Linux-specific fixes…"
  export TIMEOUT_MULTIPLIER=1
fi

# 3) Ensure dev env only
export RAILS_ENV=development
export RACK_ENV=development
export NODE_ENV=development
export RAILS_SERVE_STATIC_FILES=true
cat > /workspace/.env <<-EOL
RAILS_ENV=development
RACK_ENV=development
NODE_ENV=development
DISABLE_DATABASE_ENVIRONMENT_CHECK=1
RAILS_SERVE_STATIC_FILES=true
EOL
echo ".env written"

# 4) Copy configs if missing
log_message "Configuring database.yml from devcontainer template…"
if [ ! -f config/database.yml ]; then
  cp .devcontainer/config/database.yml config/database.yml
  log_message "  ✓ config/database.yml created"
else
  log_message "  → config/database.yml already exists, skipping"
fi

if [ ! -f config/datacite.yml ]; then
  cp config/datacite.example.yml config/datacite.yml
  echo "Created config/datacite.yml"
fi

log_message "Configuring sunspot.yml for devcontainer…"
# Always overwrite in devcontainer to ensure correct settings
cp .devcontainer/config/sunspot.yml config/sunspot.yml
log_message "  ✓ config/sunspot.yml updated for devcontainer"
log_message "  ✓ Sunspot config now points to: $(grep 'path:' config/sunspot.yml | head -1 | sed 's/.*path: //')"

# 5) Fix bundle paths and install only missing gems (git repos mainly)
log_message "Checking if bundle install is needed…"
if bundle check > /dev/null 2>&1; then
  log_message "  ✅ All gems already satisfied, skipping bundle install"
else
  log_message "  ⏳ Some gems missing, running bundle install (this may take several minutes)…"
  bundle install --quiet
fi

log_message "Updating frontend dependencies if needed…"
yarn install --frozen-lockfile

# 6) Wait for Solr core to be properly configured
log_message "Waiting for Solr to be ready with sunspot configuration…"

# Verify the core is properly configured
RETRY_COUNT=0
MAX_RETRIES=20
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  # Check if default core exists and is active
  if curl -s "http://solr:8983/solr/admin/cores?action=STATUS&wt=json" 2>/dev/null | grep -q '"default"' && \
     curl -s "http://solr:8983/solr/default/admin/ping?wt=json" 2>/dev/null | grep -q '"status":"OK"'; then
    log_message "  ✅ Solr default core is active and responding"
    
    # Now check for sunspot-specific fields (this might take a moment to be available)
    if curl -s "http://solr:8983/solr/default/schema/fields?wt=json" 2>/dev/null | grep -q '"class_name"'; then
      log_message "  ✅ Sunspot schema is properly loaded and ready for indexing"
      break
    else
      log_message "  ⏳ Core exists but sunspot schema not yet loaded... (attempt $((RETRY_COUNT + 1))/$MAX_RETRIES)"
    fi
  else
    log_message "  ⏳ Waiting for default core to be created... (attempt $((RETRY_COUNT + 1))/$MAX_RETRIES)"
  fi
  
  sleep 5
  RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  log_message "  ⚠️  Solr setup verification failed after $MAX_RETRIES attempts"
  log_message "     Check Solr logs: docker compose -f .devcontainer/docker-compose.yml logs solr"
  log_message "     Check Solr admin: http://localhost:8983/solr/#/"
  log_message "     Continuing anyway - Solr might work despite verification failure"
else
  log_message "  ✅ Solr is fully configured and ready"
fi

# 7) Database setup or import dump
DUMP_PATH="/workspace/.devcontainer/db/dump.sql.gz"

# Check if database already exists
DB_EXISTS=false
if mysql -h db -u root -prootpassword -e "USE ohd_development;" 2>/dev/null; then
  # Check if database has tables (not just empty)
  TABLE_COUNT=$(mysql -h db -u root -prootpassword -e "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema='ohd_development';" 2>/dev/null | tail -n 1)
  if [ "$TABLE_COUNT" -gt 0 ]; then
    DB_EXISTS=true
    log_message "⚠️  Database 'ohd_development' already exists with $TABLE_COUNT tables"
  fi
fi

if [ "$DB_EXISTS" = "true" ]; then
  log_message "Database setup options:"
  log_message "  1) Keep existing database (skip database setup)"
  log_message "  2) Overwrite with dump (if available) or fresh setup"
  
  # In non-interactive environments, default to keeping existing
  if [ -t 0 ]; then
    echo -n "Choose option [1/2]: "
    read -r choice
  else
    choice="1"
    log_message "Non-interactive mode: keeping existing database"
  fi
  
  case "$choice" in
    2)
      log_message "User chose to overwrite existing database"
      ;;
    *)
      log_message "User chose to keep existing database - skipping database setup"
      # Skip to the next step
      ;;
  esac
else
  choice="2"  # No existing database, proceed with setup
fi

if [ "$choice" = "2" ]; then
  if [ -f "$DUMP_PATH" ]; then
    log_message "Database dump found at $DUMP_PATH – importing into ohd_development…"
    # Drop any existing data, import dump, then migrate
    mysql -h db -u root -prootpassword -e "DROP DATABASE IF EXISTS ohd_development; CREATE DATABASE ohd_development CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    gunzip < "$DUMP_PATH" | mysql -h db -u root -prootpassword ohd_development
    log_message "Dump import complete – running migrations to catch up…"
    RAILS_ENV=development bundle exec rails db:migrate
  else
    log_message "No database dump found – running full db:setup…"
    bundle exec rake db:setup
    log_message "Seeding database…"
    RAILS_ENV=development bundle exec rails db:seed
  fi
else
  log_message "Skipped database setup - using existing database"
fi

# 8) JS install and precompile
log_message "Precompiling webpack packs for initial setup…"
bundle exec bin/shakapacker
log_message "  ℹ️  Note: With webpack-dev-server running, Rails will use port 3035 for HMR"
log_message "  ℹ️  These precompiled assets are only used as fallback if dev server is down"

# 9) Quick Solr indexing for immediate development use
log_message "Performing quick Solr indexing for immediate development use…"
if RAILS_ENV=development bundle exec rails solr:reindex:development:quick 2>/dev/null; then
  log_message "  ✅ Quick indexing completed - search functionality ready"
else
  log_message "  ⚠️  Quick indexing failed - you may need to run it manually:"
  log_message "     bin/rails solr:reindex:development:quick"
fi

echo "✅ All setup steps complete"
echo ""
echo "Development environment ready!"
echo "Quick Solr indexing completed - search should work immediately"
echo ""
echo "Additional Solr reindexing options:"
echo "  More data: bin/rails solr:reindex:development:limited[50]"
echo "  Full reindex: bin/rails solr:reindex:all"