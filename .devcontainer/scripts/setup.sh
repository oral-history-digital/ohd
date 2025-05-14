 
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

# 5) Database setup or import dump
DUMP_PATH="/workspace/.devcontainer/db/dump.sql.gz"
if [ -f "$DUMP_PATH" ]; then
  log_message "Database dump found at $DUMP_PATH – importing into ohd_development…"
  # drop any existing data, import dump, then migrate
  mysql -h db -u root -prootpassword -e "DROP DATABASE IF EXISTS ohd_development; CREATE DATABASE ohd_development CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  gunzip < "$DUMP_PATH" | mysql -h db -u root -prootpassword ohd_development
  log_message "Dump import complete – running migrations to catch up…"
  RAILS_ENV=development bin/rails db:migrate
else
  log_message "No database dump found – running full db:setup…"
  bin/rake db:setup
  log_message "Seeding database…"
  RAILS_ENV=development bin/rails db:seed
fi

# 6) JS install
log_message "Installing frontend dependencies…"
yarn install --frozen-lockfile

# Precompile webpack packs for static serve
log_message "Precompiling webpack packs…"
bin/shakapacker

echo "✅ All setup steps complete"
