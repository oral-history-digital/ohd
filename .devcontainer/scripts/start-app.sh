#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="/workspace/.devcontainer/logs"
mkdir -p "$LOG_DIR"
exec > >(tee -a "$LOG_DIR/app_start.log") 2>&1

log() { echo "[$(date '+%H:%M:%S')] $*"; }

wait_for_port() {
  local host=$1 port=$2 max=${3:-30} i=0
  until nc -z "$host" "$port"; do
    ((i++)) && [[ $i -ge $max ]] && { log "ERROR: $host:$port never came up"; exit 1; }
    log "waiting for $host:$port..."
    sleep 2
  done
}

log "Checking Solr is still available..."
wait_for_port solr 8983

# Quick health check - setup.sh already did comprehensive validation
if ! curl -s "http://solr:8983/solr/admin/cores" > /dev/null; then
  log "⚠️  Solr appears to be down - you may need to restart containers"
else
  log "✅ Solr is responding"
fi

# Check if Solr reindexing might be needed
log "Checking Solr index status..."
solr_doc_count=$(curl -s "http://solr:8983/solr/default/select?q=*:*&rows=0&wt=json" | grep -o '"numFound":[0-9]*' | cut -d':' -f2 || echo "0")
log "Current Solr index contains $solr_doc_count documents"

if [[ "$solr_doc_count" -eq 0 ]]; then
  log "⚠️  Solr index appears to be empty"
  log "Run this to reindex: bin/rails solr:reindex:all"
elif [[ "$solr_doc_count" -lt 100 ]]; then
  log "⚠️  Solr index has only $solr_doc_count documents (seems low)"
  log "Run this to reindex: bin/rails solr:reindex:all"
fi

log "Starting Rails server..."
bin/rails server -b 0.0.0.0 -d
wait_for_port localhost 3000

log "Starting Webpack dev server..."
bin/shakapacker-dev-server &>/dev/null &
wait_for_port localhost 3035 || log "⚠️  webpack port not open (optional)"

log "✅ All services are up!"
log "Run this to reindex Solr: bin/rails solr:reindex:all"
log "Open in browser via http://portal.oral-history.localhost:3000/za/en/"