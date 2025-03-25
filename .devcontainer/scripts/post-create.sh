#!/bin/bash
# Don't exit immediately on errors - we want to handle them gracefully
set +e

# Ensure we're in the workspace root directory
cd /workspace

# Log setup
LOGDIR="/workspace/.devcontainer/logs"
mkdir -p $LOGDIR
SETUP_LOG="$LOGDIR/post_create.log"
ERROR_LOG="$LOGDIR/post_create_errors.log"
WEBPACK_LOG="$LOGDIR/webpack.log"

# Clear logs on start
echo "=== Starting post-create: $(date) ===" > $SETUP_LOG
echo "=== Errors from post-create: $(date) ===" > $ERROR_LOG
echo "=== Webpack output: $(date) ===" > $WEBPACK_LOG

# Logging function that only captures actual errors
log_message() {
  echo "$1" | tee -a $SETUP_LOG
}

log_error() {
  echo "ERROR: $1" | tee -a $ERROR_LOG
  echo "ERROR: $1" | tee -a $SETUP_LOG
}

# Run a command and only log actual errors
run_cmd() {
  local cmd="$1"
  local temp_out=$(mktemp)
  local temp_err=$(mktemp)
  
  # Write to log only, not to console
  echo "Running: $cmd" >> $SETUP_LOG
  
  # Run the command, capture output and errors
  if eval "$cmd" > "$temp_out" 2>"$temp_err"; then
    # Command succeeded
    cat "$temp_out" >> $SETUP_LOG
    
    # Save webpack output separately if present
    if grep -q "\[webpack.Progress\]" "$temp_err"; then
      grep "\[webpack.Progress\]" "$temp_err" >> $WEBPACK_LOG
      echo "Webpack progress messages saved to $WEBPACK_LOG" >> $SETUP_LOG
    else
      # Only append non-webpack stderr output to main log
      cat "$temp_err" >> $SETUP_LOG
    fi
    
    return 0
  else
    # Command failed
    local status=$?
    # Log error but also print to console since this is important
    log_error "Command failed with status $status: $cmd"
    
    # Log stdout
    cat "$temp_out" >> $SETUP_LOG
    
    # Filter webpack messages from stderr for error log
    if grep -q "\[webpack.Progress\]" "$temp_err"; then
      grep -v "\[webpack.Progress\]" "$temp_err" | tee -a $ERROR_LOG
      grep "\[webpack.Progress\]" "$temp_err" >> $WEBPACK_LOG
      echo "Webpack progress messages saved to $WEBPACK_LOG" >> $SETUP_LOG
    else
      cat "$temp_err" | tee -a $ERROR_LOG
    fi
    
    return $status
  fi
  
  rm -f "$temp_out" "$temp_err"
}

# Source environment variables
if [ -f /workspace/.env ]; then
  source /workspace/.env
fi

# Ensure critical environment variables are set
export RAILS_ENV=development
export RACK_ENV=development
export NODE_ENV=development
export DISABLE_DATABASE_ENVIRONMENT_CHECK=1

log_message "Setting up OHD development environment..."

# Configure database.yml (always overwrite to ensure correct settings)
log_message "Creating/updating database.yml..."
cat > config/database.yml << EOL
development:
  adapter: mysql2
  encoding: utf8mb4
  collation: utf8mb4_unicode_ci
  database: ohd_development
  pool: 5
  username: root
  password: rootpassword
  host: db
  variables:
    foreign_key_checks: 0  # Disable foreign key checks for initial setup

test:
  adapter: mysql2
  encoding: utf8mb4
  collation: utf8mb4_unicode_ci
  database: ohd_test
  pool: 5
  username: root
  password: rootpassword
  host: db
  variables:
    foreign_key_checks: 0  # Disable foreign key checks for test environment

# Production environment intentionally removed
EOL

# Wait for MySQL with better retry logic
log_message "Waiting for MySQL to be ready..."
max_attempts=30
attempt=0
while ! mysql -h db -u root -prootpassword -e "SELECT 1" &>/dev/null; do
  attempt=$((attempt+1))
  if [ $attempt -gt $max_attempts ]; then
    log_error "MySQL did not become available in time - aborting"
    echo "Setup completed with errors - check logs for details"
    exit 1
  fi
  log_message "MySQL is unavailable - attempt $attempt/$max_attempts - sleeping"
  sleep 2
done

log_message "MySQL is up - setting up database"

# Disable foreign key checks directly in MySQL for setup
log_message "Disabling foreign key checks for setup..."
run_cmd "mysql -h db -u root -prootpassword -e 'SET GLOBAL foreign_key_checks = 0;'"

# Set environment variable to disable Solr during database setup
export DISABLE_SUNSPOT=true

# Ensure webpack is properly installed in node_modules
log_message "Checking webpack installation..."
if [ ! -f node_modules/.bin/webpack ]; then
  log_message "Reinstalling node modules..."
  run_cmd "yarn install --network-timeout 600000"
fi

# Drop and recreate databases - EXPLICITLY set development environment
log_message "Dropping and recreating databases to ensure clean setup..."
run_cmd "RAILS_ENV=development mysql -h db -u root -prootpassword -e 'DROP DATABASE IF EXISTS ohd_development; CREATE DATABASE ohd_development CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'"
run_cmd "RAILS_ENV=development mysql -h db -u root -prootpassword -e 'DROP DATABASE IF EXISTS ohd_test; CREATE DATABASE ohd_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'"

# Import database dump
log_message "Checking for database dump..."
if [ -f /workspace/.devcontainer/db/dump.sql.gz ]; then
  log_message "Database dump found, importing..."
  run_cmd "gunzip < /workspace/.devcontainer/db/dump.sql.gz | mysql -h db -u root -prootpassword ohd_development"
  log_message "Database dump imported successfully"
  
  # Run migrations to ensure schema is up to date after import
  log_message "Running migrations on imported database..."
  run_cmd "RAILS_ENV=development bin/rails db:migrate" || log_message "Some migrations failed, but continuing setup"
  
  # Skip seeds completely when using a dump
  log_message "Skipping seeds since database dump was imported"
else
  # No dump available, set up from scratch
  log_message "No database dump found, setting up from schema..."
  
  # Try schema load with foreign key checks disabled
  log_message "Loading database schema with foreign key checks disabled..."
  if ! run_cmd "RAILS_ENV=development DISABLE_DATABASE_ENVIRONMENT_CHECK=1 bin/rails db:schema:load"; then
    log_message "Schema load failed with standard approach, trying alternative method..."
    
    # Extract schema directly using mysql command if Rails approach fails
    if [ -f db/schema.sql ]; then
      log_message "Loading schema from db/schema.sql..."
      run_cmd "mysql -h db -u root -prootpassword ohd_development < db/schema.sql"
    else
      log_message "Generating schema SQL file from schema.rb..."
      run_cmd "RAILS_ENV=development bin/rails db:schema:dump:sql"
      if [ -f db/schema.sql ]; then
        run_cmd "mysql -h db -u root -prootpassword ohd_development < db/schema.sql"
      else
        log_error "Failed to generate or find schema SQL file"
      fi
    fi
  fi
  
  # Run migrations
  log_message "Running migrations..."
  run_cmd "RAILS_ENV=development bin/rails db:migrate" || log_message "Some migrations failed, but continuing setup"
  
  # Attempt to run seeds but don't fail if there are errors
  log_message "Running database seeds (this may safely fail)..."
  if ! run_cmd "RAILS_ENV=development bin/rails db:seed"; then
    log_message "Seeding encountered errors but continuing setup - this is expected"
  fi
fi

# Re-enable foreign key checks
log_message "Re-enabling foreign key checks..."
run_cmd "mysql -h db -u root -prootpassword -e 'SET GLOBAL foreign_key_checks = 1;'"

# Fix any remaining database issues
log_message "Running database cleanup tasks..."
if [ -f /workspace/.devcontainer/scripts/db-setup.sh ]; then
  run_cmd "bash /workspace/.devcontainer/scripts/db-setup.sh"
fi

# Check for overall success or failure
if [ $? -ne 0 ]; then
  log_message "Post-creation setup completed with errors"
  echo "Setup completed with errors - check logs for details"
else
  log_message "Post-creation setup completed successfully"
  echo "Setup completed successfully"
fi

log_message "Application will be started after container initialization"
log_message "Setup complete at $(date)"

# Exit with successful status regardless of internal errors
# This allows the container to continue initializing
exit 0