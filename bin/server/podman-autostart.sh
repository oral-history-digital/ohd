#!/bin/bash
# Starts the Kamal stack after a reboot on a host without systemd.
#
# Installed to ~/bin/podman-autostart.sh and started from the user's crontab by
# bin/server/bootstrap. Root's crontab (also set up by bootstrap) creates
# /run/user/<uid> before this runs.
#
# Order: clear stale podman state -> overlay leftovers -> accessories (db, solr)
#        -> kamal-proxy -> app and job containers.
# Containers are found by their Kamal labels: accessories have "service" and no
# "role"; app containers have "role"; the proxy is named kamal-proxy.

export XDG_RUNTIME_DIR="/run/user/$(id -u)"
export DBUS_SESSION_BUS_ADDRESS="unix:path=${XDG_RUNTIME_DIR}/bus"

LOG="$HOME/log/podman-autostart.log"
mkdir -p "$(dirname "$LOG")"
log() { echo "[$(date -Is)] $*" >> "$LOG"; }

log "start (UID=$(id -u))"

i=0
while [ ! -d "$XDG_RUNTIME_DIR" ] && [ "$i" -lt 120 ]; do
  sleep 1
  i=$((i + 1))
done
if [ ! -d "$XDG_RUNTIME_DIR" ]; then
  log "FATAL: $XDG_RUNTIME_DIR missing (root's crontab should create it)"
  exit 1
fi

# 1. Podman state from before the reboot (boot ID check). Only after a reboot, when
#    nothing runs. Never run "podman system migrate" otherwise: it stops all
#    running containers.
out="$(podman ps -a 2>&1)"
if grep -q "boot ID differs" <<<"$out"; then
  log "clearing stale podman runtime state"
  grep -oE '"/[^"]+"' <<<"$out" | tr -d '"' | while read -r p; do rm -rf "$p"; done
  podman system migrate >> "$LOG" 2>&1 || true
fi

# 2. Overlay work dirs left by an unclean shutdown (stopped containers only).
#    They block the mount with "permission denied" on work/work/incompat.
for c in $(podman ps -aq --filter status=exited --filter status=created 2>>"$LOG"); do
  d="$(podman inspect -f '{{.GraphDriver.Data.UpperDir}}' "$c" 2>>"$LOG" | sed 's#/diff$##')"
  [ -n "$d" ] || continue
  podman unshare chmod -R u+rwX "$d/work/work" >/dev/null 2>&1 || true
  podman unshare rm -rf "$d/work/work" >/dev/null 2>&1 || true
done

label() { # label <container-id> <key>
  podman inspect -f "{{index .Config.Labels \"$2\"}}" "$1" 2>/dev/null | grep -v '^<no value>$' || true
}

plan() { # prints: <kind> <id> <name>
  podman ps -a --format '{{.ID}} {{.Names}}' 2>>"$LOG" | while read -r id name; do
    case "$name" in
      *_replaced_*) continue ;;
    esac
    if [ "$name" = kamal-proxy ]; then
      echo "proxy $id $name"
    elif [ -n "$(label "$id" role)" ]; then
      echo "app $id $name"
    elif [ -n "$(label "$id" service)" ]; then
      echo "accessory $id $name"
    fi
  done
}

run() { # run <id> <name>
  if podman start "$1" >> "$LOG" 2>&1; then
    log "started $2"
  else
    log "FAILED to start $2"
  fi
}

PLAN="$(plan)"

log "starting accessories"
while read -r kind id name; do
  [ "$kind" = accessory ] && run "$id" "$name"
done <<<"$PLAN"

sleep 15 # give the databases time to come up

log "starting kamal-proxy"
while read -r kind id name; do
  [ "$kind" = proxy ] && run "$id" "$name"
done <<<"$PLAN"

log "starting app containers"
while read -r kind id name; do
  [ "$kind" = app ] && run "$id" "$name"
done <<<"$PLAN"

log "done"
