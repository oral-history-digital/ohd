# Hot Reloading (HMR) Guide

## Overview

Hot Module Replacement (HMR) with React Fast Refresh is configured to automatically update your React components in the browser without full page reloads.

## Quick Start After Container Rebuild

**If hot reloading isn't working after rebuilding the container, just run:**

```bash
bin/restart_webpack
```

This is the quickest way to get HMR working. The container startup script tries to start webpack automatically, but it may timeout during the initial compilation (30-60 seconds).

## How It Works

-   **Webpack Dev Server** runs on port 3035
-   **React Fast Refresh** preserves component state when possible
-   **Auto-start** on container startup via `start-app.sh`

## Usage

### Normal Operation

Just edit any React component and save - changes appear in your browser within 1-2 seconds.

### If Hot Reloading Stops Working

#### Quick Fix - Restart Webpack Dev Server

```bash
bin/restart_webpack
```

This script will:

-   Kill any existing webpack processes
-   Clean up zombie processes
-   Start a fresh webpack dev server
-   Wait for compilation to complete
-   Show you the status

#### Manual Restart

```bash
# Kill webpack
pkill -f webpack

# Start it manually (foreground - see output)
bin/shakapacker-dev-server

# OR start in background
nohup bin/shakapacker-dev-server > .devcontainer/logs/webpack-dev-server.log 2>&1 &
```

### Check Status

#### Is webpack running?

```bash
ps aux | grep webpack
```

#### Is port 3035 responding?

```bash
curl -I http://localhost:3035
```

#### View webpack logs

```bash
tail -f .devcontainer/logs/webpack-dev-server.log
```

## Common Issues

### 1. Port 3035 shows as "inactive" in VS Code

**Cause**: Webpack dev server died during startup (usually due to slow compilation or memory issues)

**Fix**:

```bash
bin/restart_webpack
```

### 2. Full page reload instead of hot update

**Cause**: React Fast Refresh couldn't preserve state (this is normal for some changes)

**When it happens**:

-   Changes to Redux store
-   Changes to React Context providers
-   Syntax errors in components
-   Changes to non-component files

**Fix**: This is expected behavior, not a bug.

### 3. "Hot Module Replacement not enabled" warning

**When**: During `bin/shakapacker` (static asset precompilation)

**Cause**: HMR is only enabled in webpack-dev-server, not during static builds

**Impact**: None - this warning is harmless and expected

## Troubleshooting

### Webpack won't start

1. **Check for port conflicts**:

    ```bash
    lsof -i :3035
    ```

2. **Check for zombie processes**:

    ```bash
    ps aux | grep defunct | grep webpack
    pkill -9 -f webpack
    ```

3. **Check available memory**:

    ```bash
    free -h
    ```

    Webpack needs at least 1-2GB RAM for compilation

4. **Check logs for errors**:
    ```bash
    tail -100 .devcontainer/logs/webpack-dev-server.log | grep -i error
    ```

### Webpack compiles but changes don't appear

1. **Hard refresh browser**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

2. **Check browser console** for WebSocket errors:

    - Open DevTools → Console
    - Look for `[webpack-dev-server]` messages
    - Should see: "App hot update..." on file changes

3. **Verify HMR is active**:
    ```bash
    curl -s http://localhost:3035/packs/js/application.js | grep -i "react.*refresh" | head -3
    ```
    Should show React Refresh runtime code

## Configuration Files

-   `config/shakapacker.yml` - HMR settings (`hmr: true`)
-   `config/webpack/webpack.config.js` - React Refresh plugin
-   `babel.config.js` - React Refresh babel transform
-   `app/javascript/packs/application.js` - HMR entry point

## Performance Notes

-   **First compilation**: 30-60 seconds (compiles everything)
-   **Hot updates**: 1-2 seconds (only recompiles changed files)
-   **Memory usage**: ~1-1.5GB for webpack process

## Production Impact

**Zero.** All HMR code is:

-   Conditionally included only for `NODE_ENV=development`
-   Removed by tree-shaking in production builds
-   Has no runtime or bundle size impact on production
