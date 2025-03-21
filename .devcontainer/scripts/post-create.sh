#!/bin/bash
set -e

# Ensure we're in the workspace root directory
cd /workspace

echo "Setting up OHD development environment..."

# Configure database.yml (always overwrite to ensure correct settings)
echo "Creating/updating database.yml..."
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

test:
  adapter: mysql2
  encoding: utf8mb4
  collation: utf8mb4_unicode_ci
  database: ohd_test
  pool: 5
  username: root
  password: rootpassword
  host: db

production:
  adapter: mysql2
  encoding: utf8mb4
  collation: utf8mb4_unicode_ci
  database: ohd_production
  pool: 5
  username: root
  password: rootpassword
  host: db
EOL

# Configure datacite.yml if needed
if [ ! -f config/datacite.yml ]; then
  cp config/datacite.example.yml config/datacite.yml
  echo "Created datacite.yml from example"
fi

# Configure sunspot.yml
cat > config/sunspot.yml << EOL
development:
  solr:
    hostname: solr
    port: 8983
    log_level: INFO
    path: /solr/default
test:
  solr:
    hostname: solr
    port: 8983
    log_level: WARNING
    path: /solr/default
production:
  solr:
    hostname: solr
    port: 8983
    log_level: WARNING
    path: /solr/default
EOL
echo "Created sunspot.yml configuration"

# Create directories needed by the application
mkdir -p tmp
touch tmp/caching-dev.txt
mkdir -p log
touch log/development.log
touch log/test.log
chmod -R 777 log
chmod -R 777 tmp
echo "Enabled caching in development"

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
until mysql -h db -u root -prootpassword -e "SELECT 1"; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "MySQL is up - setting up database"

# Set environment variable to disable Solr during database setup
export DISABLE_SUNSPOT=true

# Ensure webpack is properly installed in node_modules
echo "Checking webpack installation..."
if [ ! -f node_modules/.bin/webpack ]; then
  echo "Reinstalling node modules..."
  yarn install --network-timeout 600000
fi

# Drop and recreate databases to avoid foreign key issues
echo "Dropping and recreating databases to ensure clean setup..."
mysql -h db -u root -prootpassword -e "DROP DATABASE IF EXISTS ohd_development; CREATE DATABASE ohd_development CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -h db -u root -prootpassword -e "DROP DATABASE IF EXISTS ohd_test; CREATE DATABASE ohd_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import database dump
echo "Importing database dump..."
gunzip < /workspace/.devcontainer/db/dump.sql.gz | mysql -h db -u root -prootpassword ohd_development

echo "Post-creation setup complete!"

# Start the application
echo "Starting application..."
/bin/bash /workspace/.devcontainer/scripts/start-app.sh