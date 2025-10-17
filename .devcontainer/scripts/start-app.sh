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

# Quick health check - setup-dev.sh already did comprehensive validation
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
  log "Quick start: bin/rails solr:reindex:development:quick"
  log "More data: bin/rails solr:reindex:development:limited[10]"
  log "Full reindex: bin/rails solr:reindex:all"
elif [[ "$solr_doc_count" -lt 100 ]]; then
  log "⚠️  Solr index has only $solr_doc_count documents (seems low)"
  log "Limited reindex: bin/rails solr:reindex:development:limited[100]"
  log "Full reindex: bin/rails solr:reindex:all"
fi

log "Starting virtual display for system tests..."
export DISPLAY=:99
if ! pgrep -f "Xvfb :99" > /dev/null; then
  Xvfb :99 -screen 0 1400x1400x24 &> /dev/null &
  log "✅ Virtual display started on :99"
else
  log "✅ Virtual display already running"
fi

log "Starting Rails server..."
bin/rails server -b 0.0.0.0 -d
wait_for_port localhost 3000

log "Starting Webpack dev server with HMR enabled..."
# Clear old log file to avoid confusion
> "$LOG_DIR/webpack-dev-server.log"

# Use nohup to ensure webpack-dev-server keeps running after script exits
# Redirect stdin from /dev/null to prevent issues with background process
nohup bin/shakapacker-dev-server < /dev/null >> "$LOG_DIR/webpack-dev-server.log" 2>&1 &
WEBPACK_PID=$!
# Disown the process so it doesn't get killed when the script exits
disown $WEBPACK_PID
log "Webpack dev server started and detached (PID: $WEBPACK_PID)"

# Wait for webpack to compile (not just port opening)
# Port opens immediately but compilation takes 30-60 seconds
log "Waiting for webpack to compile (this may take 30-60 seconds on first start)..."

WEBPACK_READY=false
for i in {1..60}; do
  # Check if compilation finished successfully
  if tail -10 "$LOG_DIR/webpack-dev-server.log" 2>/dev/null | grep -q "compiled successfully"; then
    log "✅ Webpack compiled successfully!"
    WEBPACK_READY=true
    break
  fi
  
  # Check if process died
  if ! ps -p $WEBPACK_PID > /dev/null 2>&1; then
    log "⚠️  Webpack process died during compilation"
    break
  fi
  
  sleep 1
done

if [ "$WEBPACK_READY" = false ]; then
  log "⚠️  Webpack compilation didn't complete in 60 seconds"
  log "This is usually due to slow initial compilation or out of memory"
  log ""
  log "Check if process is still running:"
  ps aux | grep -E "webpack|shakapacker" | grep -v grep || log "  Process not found"
  log ""
  log "Check logs: tail -f $LOG_DIR/webpack-dev-server.log"
  log "Last 30 lines of log:"
  tail -30 "$LOG_DIR/webpack-dev-server.log" || true
  log ""
  log "To restart manually:"
  log "  bin/restart_webpack"
  log ""
  log "⏭️  Continuing anyway - webpack may still be compiling in background"
fi

log "✅ All services are up!"
log ""

if [ "$WEBPACK_READY" = false ]; then
  log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  log "⚡ HOT RELOADING: Webpack dev server needs manual start"
  log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  log ""
  log "To enable hot reloading (HMR), run:"
  log ""
  log "  bin/restart_webpack"
  log ""
  log "This will start webpack dev server and wait for compilation."
  log "See .devcontainer/HOT_RELOADING.md for more info."
  log ""
  log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  log ""
fi

log "Solr reindexing options:"
log "  Quick (10 interviews):           bin/rails solr:reindex:development:quick"
log "  Limited (10 interviews + data):  bin/rails solr:reindex:development:limited[10]"
log "  Full (all data, slow):           bin/rails solr:reindex:all"
log ""
log "🌐 Open in browser: http://portal.oral-history.localhost:3000/za/en/"