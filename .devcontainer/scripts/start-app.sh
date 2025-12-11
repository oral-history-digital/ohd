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

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "🔍 Checking Solr availability..."
wait_for_port solr 8983

# Quick health check - setup-dev.sh already did comprehensive validation
if ! curl -s "http://solr:8983/solr/admin/cores" > /dev/null; then
  log "⚠️  Solr appears to be down - you may need to restart containers"
else
  log "✅ Solr is responding"
fi

log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "🖥️  Starting virtual display for system tests..."
export DISPLAY=:99
if ! pgrep -f "Xvfb :99" > /dev/null; then
  Xvfb :99 -screen 0 1400x1400x24 &> /dev/null &
  log "✅ Virtual display started on :99"
else
  log "✅ Virtual display already running"
fi

log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "🚀 Starting Rails server..."
bin/rails server -b 0.0.0.0 -d
wait_for_port localhost 3000
log "✅ Rails server running on port 3000"

log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "📦 Starting Webpack dev server..."
bin/shakapacker-dev-server &>/dev/null &
wait_for_port localhost 3035 || log "⚠️  webpack port not open (optional)"
log "✅ Webpack dev server running on port 3035"

log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "📊 Checking Solr index status..."
solr_doc_count=$(curl -s "http://solr:8983/solr/default/select?q=*:*&rows=0&wt=json" | grep -o '"numFound":[0-9]*' | cut -d':' -f2 || echo "0")

if [[ "$solr_doc_count" -eq 0 ]]; then
  log "⚠️  Solr index appears to be empty"
else
  log "✅ Solr index contains $solr_doc_count documents"
fi

log ""
log "📚 Solr Reindexing Options:"
log "  • Quick start:  bin/rails solr:reindex:scoped LIMIT=10 WITH_RELATED=true"
log "  • More data:    bin/rails solr:reindex:scoped LIMIT=100 WITH_RELATED=true"
log "  • Full reindex: bin/rails solr:reindex:all"

log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "✅ All services started successfully!"
log ""
log "🌐 Open in browser: http://portal.oral-history.localhost:3000/"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"