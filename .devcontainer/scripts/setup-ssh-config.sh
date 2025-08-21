#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Setting up SSH configuration for deployment..."

# --- Prep ~/.ssh --------------------------------------------------------------
mkdir -p /root/.ssh
chmod 700 /root/.ssh

MOUNTED_KEY_PATH="/root/.ssh/id_deploy"
ACTUAL_KEY_PATH="/root/.ssh/id_deploy_key"
KEY_PRESENT="no"

if [[ -f "$MOUNTED_KEY_PATH" && ! -c "$MOUNTED_KEY_PATH" ]]; then
  # Copy the read-only mounted key to a different writable location
  cp "$MOUNTED_KEY_PATH" "$ACTUAL_KEY_PATH"
  chmod 600 "$ACTUAL_KEY_PATH"
  echo "✅ SSH key found and copied to $ACTUAL_KEY_PATH with permissions 600"
  KEY_PRESENT="yes"
else
  echo "⚠️  No SSH key mounted (using /dev/null fallback)"
  echo "    Check that SSH_KEY_PATH in .devcontainer/.env points to a valid key on your host."
fi

# Decide IdentityFile / IdentitiesOnly behavior
IDENTITY_LINE=""
IDENTITIES_ONLY="no"
if [[ "$KEY_PRESENT" == "yes" ]]; then
  IDENTITY_LINE="  IdentityFile $ACTUAL_KEY_PATH"
  IDENTITIES_ONLY="yes"
fi

# Helper to write a Host block if alias+fqdn exist (user/port have sensible defaults)
write_host_block() {
  local alias="$1" fqdn="$2" user="${3:-deploy}" port="${4:-22}"

  [[ -z "${alias}" || -z "${fqdn}" ]] && return 0

  cat <<EOF

Host ${alias}
  HostName ${fqdn}
  User ${user}
  Port ${port}
${IDENTITY_LINE}
  IdentitiesOnly ${IDENTITIES_ONLY}
  StrictHostKeyChecking accept-new
EOF
}

# --- Build ~/.ssh/config from scratch ----------------------------------------
CONFIG_TMP="$(mktemp)"
{
  # Staging
  write_host_block "${STAGING_ALIAS:-}" "${STAGING_FQDN:-}" "${STAGING_USER:-deploy}" "${STAGING_PORT:-22}"

  # Production
  write_host_block "${PROD_ALIAS:-}" "${PROD_FQDN:-}" "${PROD_USER:-deploy}" "${PROD_PORT:-22}"
} > "$CONFIG_TMP"

# Only install the config if we actually wrote any Host blocks
if [[ -s "$CONFIG_TMP" ]]; then
  mv "$CONFIG_TMP" /root/.ssh/config
  chmod 600 /root/.ssh/config
  echo "✅ SSH config written to /root/.ssh/config"
else
  rm -f "$CONFIG_TMP"
  echo "⚠️  No SSH hosts were configured (missing env vars?)."
  echo "    Create .devcontainer/.env based on your template."
fi

# --- /etc/hosts mappings (Option 1 runtime injection) ------------------------
add_host() {
  local ip="$1" fqdn="$2" alias="$3"
  [[ -z "${ip}" || -z "${fqdn}" ]] && return 0
  if ! grep -Eq "^[[:space:]]*${ip//./\\.}[[:space:]]+${fqdn}( |$)" /etc/hosts 2>/dev/null; then
    echo "${ip} ${fqdn} ${alias:-}" >> /etc/hosts
    echo "🧩 Added hosts mapping: ${ip} ${fqdn} ${alias:-}"
  else
    echo "🧩 Hosts mapping already present for ${fqdn}"
  fi
}

add_host "${STAGING_IP:-}" "${STAGING_FQDN:-}" "${STAGING_ALIAS:-}"
add_host "${PROD_IP:-}"    "${PROD_FQDN:-}"    "${PROD_ALIAS:-}"

# --- DNS configuration for VPN access ----------------------------------------
echo "🌐 Checking DNS configuration..."

# Test if VPN DNS servers are reachable before using them
if [[ -n "${VPN_DNS1:-}" ]] || [[ -n "${VPN_DNS2:-}" ]]; then
  echo "🔍 Testing VPN DNS server connectivity..."
  
  VPN_DNS_REACHABLE=false
  if [[ -n "${VPN_DNS1:-}" ]] && timeout 2 dig @${VPN_DNS1} google.com >/dev/null 2>&1; then
    echo "✅ VPN DNS ${VPN_DNS1} is reachable"
    VPN_DNS_REACHABLE=true
  elif [[ -n "${VPN_DNS2:-}" ]] && timeout 2 dig @${VPN_DNS2} google.com >/dev/null 2>&1; then
    echo "✅ VPN DNS ${VPN_DNS2} is reachable"
    VPN_DNS_REACHABLE=true
  fi
  
  if [[ "$VPN_DNS_REACHABLE" == "true" ]]; then
    echo "🔧 Appending VPN DNS servers to existing configuration..."
    
    # Backup original resolv.conf
    cp /etc/resolv.conf /etc/resolv.conf.backup
    
    # Append VPN DNS servers (don't replace, preserve Docker's DNS)
    {
      echo "# VPN DNS servers added by setup script"
      [[ -n "${VPN_DNS1:-}" ]] && echo "nameserver ${VPN_DNS1}"
      [[ -n "${VPN_DNS2:-}" ]] && echo "nameserver ${VPN_DNS2}"
    } >> /etc/resolv.conf
    
    echo "✅ VPN DNS servers appended to existing configuration"
  else
    echo "⚠️  VPN DNS servers not reachable (VPN not connected?)"
    echo "ℹ️  Using default DNS configuration only"
  fi
else
  echo "ℹ️  No VPN DNS servers configured"
fi

echo "🔍 Testing DNS resolution..."

if [[ -n "${STAGING_FQDN:-}" ]]; then
  if timeout 5 getent hosts "${STAGING_FQDN:-}" >/dev/null 2>&1; then
    echo "✅ VPN domain (${STAGING_FQDN}): resolved successfully"
  else
    echo "ℹ️  VPN domain (${STAGING_FQDN}): will resolve when VPN connected"
  fi
fi

# --- Quick visibility / sanity checks ----------------------------------------
if [[ -n "${STAGING_ALIAS:-}" ]]; then
  echo "🔎 SSH HostName for ${STAGING_ALIAS}: $(ssh -G "${STAGING_ALIAS}" 2>/dev/null | sed -n 's/^hostname //p' || echo 'n/a')"
fi
if [[ -n "${PROD_ALIAS:-}" ]]; then
  echo "🔎 SSH HostName for ${PROD_ALIAS}:    $(ssh -G "${PROD_ALIAS}" 2>/dev/null | sed -n 's/^hostname //p' || echo 'n/a')"
fi

echo ""
echo "✅ SSH configuration setup complete!"
echo ""
echo "To deploy:"
echo "  Staging:    bundle exec cap ohd_archive_staging deploy"
echo "  Production: bundle exec cap ohd_archive deploy"
echo ""
echo "To test SSH connections:"
echo "  Staging:    ssh -vvv ${STAGING_ALIAS:-<staging-alias>}"
echo "  Production: ssh -vvv ${PROD_ALIAS:-<prod-alias>}"
echo ""
echo "💡 After connecting/disconnecting VPN, re-run this script"