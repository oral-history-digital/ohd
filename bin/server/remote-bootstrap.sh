#!/bin/bash
# Bootstraps one host for rootless Podman + Kamal.
#
# Runs ON THE SERVER. bin/server/bootstrap copies this file, podman-autostart.sh
# and layout.txt into a temp dir and runs:  bash remote-bootstrap.sh <dir>
#
# Idempotent: every step checks the current state first and only changes what is
# missing or wrong. Needs passwordless sudo for the few steps that touch the system.
set -euo pipefail

STAGE="${1:?usage: remote-bootstrap.sh <stage-dir>}"
LAYOUT="$STAGE/layout.txt"
AUTOSTART_SRC="$STAGE/podman-autostart.sh"

USERN="$(id -un)"
GROUPN="$(id -gn)"
UIDN="$(id -u)"
MARK="# ohd-bootstrap"

say()  { echo "  - $*"; }
warn() { echo "  ! WARNING: $*" >&2; }
die()  { echo "ERROR: $*" >&2; exit 1; }

[ "$UIDN" -ne 0 ] || die "run this as the deploy user (e.g. avd1), not root"
sudo -n true 2>/dev/null || die "passwordless sudo is required (sudo -n true must work)"
SUDO="sudo -n"

# Podman refuses to run after a reboot while its runtime state from the old boot
# is still there. It names the directories to delete in the error message.
clear_stale_podman_state() {
  local out
  out="$(podman ps -a 2>&1 || true)"
  if grep -q "boot ID differs" <<<"$out"; then
    say "clearing podman runtime state from before the last reboot"
    grep -oE '"/[^"]+"' <<<"$out" | tr -d '"' | while read -r p; do rm -rf "$p"; done
  fi
}

echo "==> packages"
REQUIRED="podman uidmap slirp4netns cron"
OPTIONAL="passt"
need=""
for p in $REQUIRED; do dpkg -s "$p" >/dev/null 2>&1 || need="$need $p"; done
if [ -n "$need" ]; then
  command -v apt-get >/dev/null 2>&1 || die "missing packages:$need (no apt-get here, install them by hand)"
  say "installing:$need"
  $SUDO apt-get update -qq
  $SUDO env DEBIAN_FRONTEND=noninteractive apt-get install -y -qq $need
else
  say "required packages present"
fi
for p in $OPTIONAL; do
  if dpkg -s "$p" >/dev/null 2>&1; then
    say "$p present"
  elif $SUDO env DEBIAN_FRONTEND=noninteractive apt-get install -y -qq "$p" >/dev/null 2>&1; then
    say "installed $p"
  else
    warn "optional package $p not available"
  fi
done
command -v podman >/dev/null 2>&1 || die "podman is still not installed"

echo "==> rootless user namespace"
subuid_added=0
if ! grep -q "^$USERN:" /etc/subuid 2>/dev/null; then
  $SUDO usermod --add-subuids 100000-165535 "$USERN"; subuid_added=1
fi
if ! grep -q "^$USERN:" /etc/subgid 2>/dev/null; then
  $SUDO usermod --add-subgids 100000-165535 "$USERN"; subuid_added=1
fi
if [ "$subuid_added" -eq 1 ]; then say "added subuid/subgid range (podman system migrate runs at boot)"; else say "subuid/subgid present"; fi

cur_port="$(cat /proc/sys/net/ipv4/ip_unprivileged_port_start)"
if [ "$cur_port" -gt 80 ]; then
  echo "net.ipv4.ip_unprivileged_port_start=80" | $SUDO tee /etc/sysctl.d/99-rootless-ports.conf >/dev/null
  $SUDO sysctl -q -w net.ipv4.ip_unprivileged_port_start=80
  say "rootless ports from 80 (sysctl)"
else
  say "rootless ports from 80 already set"
fi

echo "==> runtime dir and mount propagation (no systemd: done by root's crontab)"
$SUDO mkdir -p "/run/user/$UIDN"
$SUDO chown "$USERN:$GROUPN" "/run/user/$UIDN"
$SUDO chmod 700 "/run/user/$UIDN"
$SUDO mount --make-rshared / 2>/dev/null || warn "could not make / shared (podman will warn about mounts)"
existing_root="$($SUDO crontab -l 2>/dev/null || true)"
{
  printf '%s\n' "$existing_root" | grep -v -e "ohd-bootstrap" -e "/run/user/$UIDN" | grep -v '^$' || true
  echo "@reboot mkdir -p /run/user/$UIDN && chown $USERN:$GROUPN /run/user/$UIDN && chmod 700 /run/user/$UIDN $MARK"
  echo "@reboot mount --make-rshared / $MARK"
} > "$STAGE/root.crontab"
$SUDO crontab "$STAGE/root.crontab"
say "root crontab: runtime dir and mount propagation at boot"

if [ "${XDG_RUNTIME_DIR:-}" = "/run/user/$UIDN" ]; then
  say "XDG_RUNTIME_DIR is set in ssh sessions"
else
  warn "XDG_RUNTIME_DIR is '${XDG_RUNTIME_DIR:-unset}' in ssh sessions, not /run/user/$UIDN."
  warn "  podman then picks another runtime dir than the autostart script. Export XDG_RUNTIME_DIR=/run/user/$UIDN"
  warn "  for non-interactive sessions (e.g. ~/.pam_environment), then re-run."
fi

echo "==> directories and ownership"
clear_stale_podman_state
while read -r kind path uid; do
  [ "$kind" = DIR ] || continue
  case "$path" in
    /*) abs="$path" ;;
    *)  abs="$HOME/$path" ;;
  esac
  mkdir -p "$abs"
  if [ "$uid" = "-" ]; then
    say "$abs (no container uid known, left as is)"
    continue
  fi
  have="$(podman unshare stat -c '%u:%g' "$abs")"
  if [ "$have" = "$uid:$uid" ]; then
    say "$abs (ok, uid $uid)"
  else
    say "$abs: owner $have -> $uid:$uid"
    # Group first: a group that is not mapped in the user namespace (e.g. app-avd)
    # makes podman unshare chown fail.
    $SUDO chown -R "$USERN:$GROUPN" "$abs"
    podman unshare chown -R "$uid:$uid" "$abs"
  fi
done < "$LAYOUT"

echo "==> autostart"
mkdir -p "$HOME/bin" "$HOME/log"
install -m 755 "$AUTOSTART_SRC" "$HOME/bin/podman-autostart.sh"
say "installed ~/bin/podman-autostart.sh"
existing_user="$(crontab -l 2>/dev/null || true)"
{
  printf '%s\n' "$existing_user" | grep -v -e "ohd-bootstrap" -e "podman-autostart.sh" | grep -v '^$' || true
  echo "$MARK: start containers after reboot (see ~/bin/podman-autostart.sh)"
  echo "@reboot sleep 30 && /bin/bash \"\$HOME/bin/podman-autostart.sh\" >> \"\$HOME/log/podman-autostart.cron.log\" 2>&1"
} | crontab -
say "user crontab: autostart at reboot"

echo "==> status"
podman ps -a --format '  {{.Names}} {{.State}}' || warn "podman ps failed"
crontab -l | grep -F "$MARK" | sed 's/^/  user cron: /' || true
$SUDO crontab -l | grep -F "$MARK" | sed 's/^/  root cron: /' || true
echo "  done"
