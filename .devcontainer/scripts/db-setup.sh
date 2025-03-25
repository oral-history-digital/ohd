#!/bin/bash
set -e

# Ensure we're in the workspace root directory
cd /workspace

# Log file setup
LOGDIR="/workspace/.devcontainer/logs"
mkdir -p $LOGDIR
DB_LOG="$LOGDIR/database_setup.log"

echo "=== Starting database setup: $(date) ===" | tee -a $DB_LOG

# Log to file
exec >> $DB_LOG 2>&1

echo "Attempting to fix any database foreign key constraint issues..."

# Connect to database and disable foreign key checks
mysql -h db -u root -prootpassword -e "
USE ohd_development;
SET FOREIGN_KEY_CHECKS=0;

-- Allow schema operations to complete without foreign key constraints
-- Reset any incomplete migrations
DELETE FROM schema_migrations WHERE version IS NULL OR version = '';

-- Enable constraints when done
SET FOREIGN_KEY_CHECKS=1;
"

echo "Database fixed successfully"