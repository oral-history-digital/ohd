#!/bin/bash
set -e

# Set up logging
LOGDIR="/workspace/.devcontainer/logs"
mkdir -p $LOGDIR
ERROR_LOG="$LOGDIR/setup_errors.log"
SETUP_LOG="$LOGDIR/setup.log"

echo "=== Starting setup: $(date) ===" | tee -a $SETUP_LOG

# Log both to console and log file
exec > >(tee -a $SETUP_LOG) 2> >(tee -a $ERROR_LOG >&2)

# Detect if we're running on Mac (Darwin-based host)
if [ -f /proc/version ] && grep -q Darwin /proc/version 2>/dev/null; then
  echo "Mac host detected, applying Mac-specific fixes..."
  
  # Force TCP connections rather than socket for MySQL
  sed -i 's/host: db/host: db\n  socket: false/' config/database.yml 2>/dev/null || true
  
  # Touch migration files to ensure consistent timestamps
  find db/migrate -name "*.rb" -exec touch {} \; 2>/dev/null || true
  
  # Allow more time for database operations
  export TIMEOUT_MULTIPLIER=3
else
  echo "Linux host detected, applying Linux-specific fixes..."
  # Any Linux-specific fixes would go here
  export TIMEOUT_MULTIPLIER=1
fi

# CRITICAL: Ensure we're never using production in development container
echo "Ensuring development environment is used..."
export RAILS_ENV=development
export RACK_ENV=development
export NODE_ENV=development

# Create environment file to persist these settings
cat > /workspace/.env << EOL
RAILS_ENV=development
RACK_ENV=development
NODE_ENV=development
DISABLE_DATABASE_ENVIRONMENT_CHECK=1
EOL

echo "Environment variables set and saved to .env file"
echo "Platform fixes complete"