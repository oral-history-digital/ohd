#!/bin/bash
# Devcontainer entrypoint — runs as root (the container default user).
# Fixes ownership on volume mount points, then hands off to sleep infinity.
# VS Code's remoteUser:vscode ensures all interactive processes run as vscode.

set -e

# Volume mount points that Docker creates as root:root
dirs=( /workspace/.devcontainer/logs
  /workspace/tmp
  /workspace/tmp/cache
  /workspace/node_modules
  /workspace/log )

for dir in "${dirs[@]}"; do
  mkdir -p "$dir"

  # Recursively fix only when needed to keep startup fast on warm containers.
  if [[ "$(stat -c %u "$dir")" != "1000" || "$(stat -c %g "$dir")" != "1000" ]]; then
    chown -R vscode:vscode "$dir"
  fi
done

# The bundle volume can contain nested root-owned files copied from image layers.
# Always fix recursively so Bundler can write to cache and installed gem directories.
chown -R vscode:vscode /usr/local/bundle

exec sleep infinity
