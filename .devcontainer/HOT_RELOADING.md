# Hot Reloading (HMR) Guide

## Overview

Hot Module Replacement (HMR) with React Fast Refresh is configured to automatically update your React components in the browser without full page reloads.

## Architecture

The development environment uses a **separate webpack container** for better isolation and performance:

- **`webpack` container**: Runs webpack-dev-server on port 3035
- **`app` container**: Runs Rails on port 3000
- **Shared volume**: Both containers share `/workspace` so webpack can write manifest to disk
- **Network**: Rails proxies asset requests to webpack internally via Docker network
- **Browser**: Connects to webpack HMR WebSocket at `localhost:3035`

## How It Works

- **Webpack Dev Server** runs in separate container on port 3035
- **React Fast Refresh** preserves component state when possible
- **Auto-start** on container startup via `start-app.sh`
- **Manifest sync**: Webpack writes `manifest.json` to disk so Rails can read asset hashes

## Usage

### Normal Operation

Just edit any React component and save - changes appear in your browser within 1-2 seconds.

### After Container Rebuild

The startup script automatically:

1. Cleans stale webpack manifest from previous run
2. Waits for webpack container to be ready
3. Triggers initial compilation by touching `application.js`
4. Waits for manifest to be written to disk
5. Only then allows Rails to start serving requests

**If Rails starts before webpack finishes compiling**, you'll see "Shakapacker can't find application.js" error. The startup script should prevent this, but if it happens:

```bash
# Wait a moment for webpack to finish compiling, then refresh browser
# OR restart the webpack container:
docker compose restart webpack
```

### If Hot Reloading Stops Working

#### Quick Fix - Restart Webpack Container

From your **host machine** (not inside devcontainer):

```bash
cd .devcontainer/dev
docker compose restart webpack
```

#### Or from inside the app container:

The webpack dev server runs in a **separate container**, so you can't directly restart it from the app container. You need to restart the container itself from the host.

### Check Status

#### Is webpack container running?

From host machine:

```bash
cd .devcontainer/dev
docker compose ps webpack
```

#### Is webpack dev server responding?

From app container:

```bash
curl -I http://webpack:3035
```

From host machine or browser:

## Common Issues

### 1. "Shakapacker can't find application.js" after rebuild

**Cause**: Rails started before webpack finished initial compilation

**Why**: The first compilation after rebuild takes 30-60 seconds. The startup script tries to wait for it, but may timeout.

**Fix**: Just wait a minute and refresh. Or restart webpack container:

```bash
# From host machine
cd .devcontainer/dev
docker compose restart webpack
```

### 2. Stale asset hashes (404 errors for JS files)

**Cause**: `public/packs/manifest.json` persisted from previous container run with different hashes

**Prevention**: The startup script now automatically cleans this file

**Manual fix** (if it happens):

```bash
rm /workspace/public/packs/manifest.json
touch /workspace/app/javascript/packs/application.js  # trigger recompile
```

### 3. Port 3035 not accessible from browser

**Cause**: Webpack container not running or port not forwarded correctly

**Check**:

```bash
# From host
docker compose -f .devcontainer/dev/docker-compose.yml ps webpack
curl -I http://localhost:3035
```

**Fix**: Rebuild containers:

```bash
cd .devcontainer/dev
docker compose down
docker compose up -d
```

### 4. Full page reload instead of hot update

**Cause**: React Fast Refresh couldn't preserve state (this is normal for some changes)

**When it happens**:

- Changes to Redux store
- Changes to React Context providers
