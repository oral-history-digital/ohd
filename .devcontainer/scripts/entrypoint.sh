#!/bin/bash
# Devcontainer entrypoint — runs as root (the container default user).
# Fixes ownership on volume mount points, then hands off to sleep infinity.
# VS Code's remoteUser:vscode ensures all interactive processes run as vscode.

set -e

# Volume mount points that Docker creates as root:root
dirs=( /workspace/.devcontainer/logs
       /workspace/tmp
       /workspace/node_modules
       /workspace/log )

for dir in "${dirs[@]}"; do
  mkdir -p "$dir"
  chown -R vscode:vscode "$dir"
done

exec sleep infinity
