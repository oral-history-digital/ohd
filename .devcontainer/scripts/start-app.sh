#!/bin/bash

# Create log directory and set up logging - from postStartCommand
LOG_DIR="/workspace/.devcontainer/logs"
mkdir -p $LOG_DIR
START_LOG="${LOG_DIR}/app_start.log"

# Add delay for container initialization - from postStartCommand
echo "Waiting 10 seconds for the container to fully initialize..." | tee -a $START_LOG
sleep 10
echo "Starting application services..." | tee -a $START_LOG
cd /workspace

# Log everything to file as well as console - from postStartCommand 
exec > >(tee -a $START_LOG) 2>&1

# Avoid terminating on errors - we want to handle them ourselves
set +e

# Add hosts entry if it doesn't exist
if ! grep -q "portal.oral-history.localhost" /etc/hosts; then
  echo "Adding portal.oral-history.localhost entry to /etc/hosts..."
  echo "127.0.0.1 portal.oral-history.localhost" | tee -a /etc/hosts
fi

# Stop any running processes first
echo "Cleaning up any running processes..."

# Stop Rails server if running
if [ -f /workspace/tmp/pids/server.pid ]; then
  echo "Stopping existing Rails server..."
  kill -9 $(cat /workspace/tmp/pids/server.pid) 2>/dev/null || true
  rm -f /workspace/tmp/pids/server.pid
fi

# Stop webpack dev server if running
WEBPACK_PIDS=$(ps aux | grep "shakapacker-dev-server" | grep -v grep | awk '{print $2}')
if [ -n "$WEBPACK_PIDS" ]; then
  echo "Stopping existing webpack dev server..."
  kill -9 $WEBPACK_PIDS 2>/dev/null || true
fi

# Stop Solr if running
echo "Stopping Solr if running..."
cd /workspace && bin/rake sunspot:solr:stop 2>/dev/null || true
sleep 2

# Make sure directory exists for Rails server PID
mkdir -p /workspace/tmp/pids

# Start Solr in the background
echo "Starting Solr..."
cd /workspace && bin/rake sunspot:solr:start

# Directly start Rails server to better control how it starts
echo "Starting Rails server..."
cd /workspace
bin/rails server -b 0.0.0.0 -d

# Start webpack server directly
echo "Starting webpack server..."
cd /workspace && bin/shakapacker-dev-server &

# Wait for servers to initialize
sleep 5

# Check if Rails server is running
if [ ! -f /workspace/tmp/pids/server.pid ]; then
  echo "ERROR: Rails server failed to start!"
  # DON'T exit with error - we want to continue to show logs
  echo "App startup failed - try running this script again manually"
else
  # Check if the server is actually responding
  echo "Checking if Rails server is responding..."
  max_attempts=12
  attempt=0
  while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:3000 > /dev/null; then
      echo "Rails server is responding!"
      break
    fi
    echo "Waiting for Rails server (attempt $((attempt+1))/$max_attempts)..."
    attempt=$((attempt+1))
    sleep 5
    
    # Show Rails server status on last attempt
    if [ $attempt -eq $max_attempts ]; then
      echo "WARNING: Rails server is not responding after 60 seconds"
      echo "Rails processes:"
      ps aux | grep rails | grep -v grep
      echo "Rails server output:"
      tail -n 30 log/development.log
      
      # Restart the server explicitly binding to all interfaces
      echo "Attempting to restart Rails server with explicit binding..."
      cd /workspace
      if [ -f /workspace/tmp/pids/server.pid ]; then
        kill -9 $(cat /workspace/tmp/pids/server.pid) 2>/dev/null || true
        rm -f /workspace/tmp/pids/server.pid
      fi
      bin/rails server -b 0.0.0.0 -d -p 3000
      sleep 5
    fi
  done
fi

echo "Application services started in the background."
echo "You can view Rails logs in log/development.log"
echo "You can view logs in ${LOG_DIR}/"
echo "Access the application at http://portal.oral-history.localhost:3000/za/de"
echo "Admin login: alice@example.com / password"

# Exit successfully to let post-create.sh complete
exit 0