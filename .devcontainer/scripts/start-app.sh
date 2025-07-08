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

log "Waiting for Solr to be available..."
wait_for_port solr 8983

log "Starting Rails server..."
bin/rails server -b 0.0.0.0 -d
wait_for_port localhost 3000

log "Starting Webpack dev server..."
bin/shakapacker-dev-server &>/dev/null &
wait_for_port localhost 3035 || log "⚠️  webpack port not open (optional)"

log "✅ All services are up!"
log "Open in browser via http://portal.oral-history.localhost:3000/za/en/"