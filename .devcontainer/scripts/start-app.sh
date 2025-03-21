#!/bin/bash

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
bin/rake sunspot:solr:stop 2>/dev/null || true
sleep 2

# Reindex Solr to ensure search works
echo "Starting and reindexing Solr..."
bin/rake sunspot:solr:start
#bin/rake sunspot:reindex || echo "Solr reindexing failed, search may not work correctly"

# Start webpack dev server in the background
echo "Starting webpack dev server..."
bin/shakapacker-dev-server &
WEBPACK_PID=$!

# Wait a moment to let webpack start
sleep 3

# Start Rails server
echo "Starting Rails server..."
bin/rails server -b 0.0.0.0

echo "Access the application at http://portal.oral-history.localhost:3000/za/de"
echo "Admin login: alice@example.com / password"

# Clean up background processes when script exits
function cleanup {
  echo "Stopping background processes..."
  kill $WEBPACK_PID 2>/dev/null || true
  bin/rake sunspot:solr:stop 2>/dev/null || true
}
trap cleanup EXIT