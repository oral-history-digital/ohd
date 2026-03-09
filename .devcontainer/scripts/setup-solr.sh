#!/usr/bin/env bash
set -euo pipefail

echo "Starting Solr…"
solr start -f &
SOLR_PID=$!

echo "Waiting for Solr to be ready…"
for i in $(seq 1 40); do
  curl -s http://localhost:8983/solr/admin/cores > /dev/null 2>&1 && break
  kill -0 $SOLR_PID 2>/dev/null || { echo "Solr process died"; exit 1; }
  sleep 3
done
curl -s http://localhost:8983/solr/admin/cores > /dev/null 2>&1 || { echo "Solr failed to start"; exit 1; }

echo "Creating default core if needed…"
if curl -s 'http://localhost:8983/solr/admin/cores?action=STATUS&wt=json' | grep -q '"default"'; then
  echo "  ✓ Default core already exists"
else
  curl -sf -X POST 'http://localhost:8983/solr/admin/cores?action=CREATE&name=default&configSet=sunspot' \
    || { echo "Failed to create default core"; exit 1; }
  echo "  ✓ Default core created"
fi

echo "Solr setup complete"
wait $SOLR_PID
