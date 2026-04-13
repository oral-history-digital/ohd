#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="/workspace/.devcontainer/logs"
mkdir -p "$LOG_DIR"
exec > >(tee -a "$LOG_DIR/app_start.log") 2>&1

log() { echo "[$(date '+%H:%M:%S')] $*"; }

cd /workspace

wait_for_port() {
  local host=$1 port=$2 max=${3:-30} i=0
  until nc -z "$host" "$port"; do
    i=$((i + 1))
    [[ $i -ge $max ]] && { log "ERROR: $host:$port never came up"; exit 1; }
    log "waiting for $host:$port..."
    sleep 2
  done
}

# Like wait_for_port but returns non-zero instead of exiting on timeout
wait_for_port_soft() {
  local host=$1 port=$2 max=${3:-15} i=0
  until nc -z "$host" "$port"; do
    i=$((i + 1))
    [[ $i -ge $max ]] && return 1
    sleep 2
  done
}

log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "🔍 Checking Solr availability..."
wait_for_port solr 8983
log "✅ Solr is responding"

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
if nc -z localhost 3000; then
  log "✅ Rails server already running on port 3000"
else
  rm -f tmp/pids/server.pid
  bin/rails server -b 0.0.0.0 -d
  wait_for_port localhost 3000
  log "✅ Rails server running on port 3000"
fi

log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "📦 Starting Webpack dev server..."
if nc -z localhost 3035; then
  log "✅ Webpack dev server already running on port 3035"
else
  # Kill stale webpack process only if process exists but port is not serving.
  if pgrep -f "shakapacker-dev-server" > /dev/null; then
    log "Stopping stale Webpack dev server process..."
    pkill -f "shakapacker-dev-server" || true
    sleep 2
  fi
  # setsid creates a new process session, fully detaching webpack from the
  # postStartCommand process group so VS Code can't kill it when the script exits.
  setsid nohup bin/shakapacker-dev-server > "$LOG_DIR/webpack.log" 2>&1 < /dev/null &
  disown
  if wait_for_port_soft localhost 3035; then
    log "✅ Webpack dev server running on port 3035"
  else
    log "⚠️  Webpack dev server port not open yet (continuing anyway)"
  fi
fi

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
log "Solr Reindexing Options:"
log "  • Quick start:         bin/rake solr:reindex:scoped LIMIT=10 WITH_RELATED=true"
log "  • More data:           bin/rake solr:reindex:scoped LIMIT=100 WITH_RELATED=true"
log "  • By project:          bin/rake solr:reindex:scoped PROJECT_SHORTNAME=za LIMIT=50 WITH_RELATED=true"
log "  • Other model:         bin/rake solr:reindex:scoped MODEL=RegistryEntry"
log "  • Full reindex:        bin/rake solr:reindex:all"

log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "Database Import"
log "To re-import database from .devcontainer/db/dump.sql.gz, run:"
log "    bin/rake database:reimport"

log ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "✅ All services started successfully!"
log ""
log "🌐 Open in browser: http://portal.oral-history.localhost:3000/"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"