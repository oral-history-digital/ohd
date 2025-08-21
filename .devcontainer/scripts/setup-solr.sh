#!/usr/bin/env bash
set -euo pipefail

echo "=== Solr Setup Script Starting ==="
echo "Date: $(date)"
echo "Working directory: $(pwd)"

# Check if required commands exist
echo "=== Checking prerequisites ==="
which curl || { echo "ERROR: curl not found"; exit 1; }
which timeout || { echo "ERROR: timeout not found"; exit 1; }

# Check if the original entrypoint exists
if [ -f "/opt/docker-solr/scripts/docker-entrypoint.sh" ]; then
    echo "Found standard Solr entrypoint"
    ENTRYPOINT="/opt/docker-solr/scripts/docker-entrypoint.sh"
elif [ -f "/usr/local/bin/docker-entrypoint.sh" ]; then
    echo "Found entrypoint in /usr/local/bin"
    ENTRYPOINT="/usr/local/bin/docker-entrypoint.sh"
else
    echo "ERROR: Could not find docker-entrypoint.sh script"
    echo "Available files in /opt/docker-solr/scripts/:"
    ls -la /opt/docker-solr/scripts/ || echo "Directory not found"
    echo "Available files in /usr/local/bin/:"
    ls -la /usr/local/bin/ || echo "Directory not found"
    exit 1
fi

echo "=== Starting Solr in background ==="
echo "Using entrypoint: $ENTRYPOINT"
$ENTRYPOINT solr-foreground &
SOLR_PID=$!
echo "Solr PID: $SOLR_PID"

# Give Solr a moment to start
sleep 10

echo "=== Waiting for Solr to be ready ==="
ATTEMPTS=0
MAX_ATTEMPTS=40
while [ $ATTEMPTS -lt $MAX_ATTEMPTS ]; do
    ATTEMPTS=$((ATTEMPTS + 1))
    echo "Attempt $ATTEMPTS/$MAX_ATTEMPTS - checking Solr..."
    
    if curl -s http://localhost:8983/solr/admin/cores > /dev/null 2>&1; then
        echo "✅ Solr is responding!"
        break
    fi
    
    if ! kill -0 $SOLR_PID 2>/dev/null; then
        echo "❌ Solr process has died!"
        exit 1
    fi
    
    echo "Still waiting for Solr..."
    sleep 3
done

if [ $ATTEMPTS -eq $MAX_ATTEMPTS ]; then
    echo "❌ Solr failed to start after $MAX_ATTEMPTS attempts"
    exit 1
fi

echo "=== Checking for default core ==="
CORE_EXISTS=false
if curl -s 'http://localhost:8983/solr/admin/cores?action=STATUS&wt=json' | grep -q '"default"'; then
    if curl -s 'http://localhost:8983/solr/default/admin/ping?wt=json' | grep -q '"status":"OK"'; then
        echo "✅ Default core already exists and is working"
        CORE_EXISTS=true
    else
        echo "⚠️ Default core exists but not responding, recreating..."
        curl -X POST 'http://localhost:8983/solr/admin/cores?action=UNLOAD&core=default&deleteIndex=true&deleteDataDir=true&deleteInstanceDir=true' || true
        sleep 2
    fi
fi

echo "=== Preparing Solr 8 compatible configset ==="
# Create a Solr 8-compatible configset from the original sunspot configset
if [ -f "/workspace/.devcontainer/config/schema-solr8.xml" ]; then
    echo "Found Solr 8-compatible schema, creating modified configset..."
    
    ORIGINAL_CONFIGSET="/var/solr/data/configsets/sunspot"
    # Create configset in a temporary directory, then make sure Solr can find it
    TEMP_CONFIGSET="/tmp/sunspot_solr8"
    
    if [ -d "$ORIGINAL_CONFIGSET" ]; then
        # Create a new configset directory with Solr 8-compatible schema
        echo "Creating sunspot_solr8 configset in temp directory..."
        mkdir -p "$TEMP_CONFIGSET/conf"
        
        # Copy all files from the original configset except schema.xml
        echo "Copying configset files (except schema.xml)..."
        if [ -d "$ORIGINAL_CONFIGSET/conf" ]; then
            for file in "$ORIGINAL_CONFIGSET/conf"/*; do
                filename=$(basename "$file")
                if [ "$filename" != "schema.xml" ] && [ -f "$file" ]; then
                    cp "$file" "$TEMP_CONFIGSET/conf/"
                    echo "Copied $filename"
                fi
            done
        fi
        
        # Copy the Solr 8-compatible schema
        echo "Using Solr 8-compatible schema..."
        cp "/workspace/.devcontainer/config/schema-solr8.xml" "$TEMP_CONFIGSET/conf/schema.xml"
        
        # Check if we can copy to the Solr data configsets directory
        echo "Attempting to copy configset to Solr data directory..."
        if cp -r "$TEMP_CONFIGSET" "/var/solr/data/configsets/" 2>/dev/null; then
            echo "✅ Successfully copied sunspot_solr8 configset to data directory"
            CONFIGSET_LOCATION="data"
        else
            echo "⚠️ Could not copy configset to standard locations, using instanceDir approach"
            CONFIGSET_LOCATION="instancedir"
        fi
        
        # Verify the copy worked
        if [ -f "$TEMP_CONFIGSET/conf/schema.xml" ] && grep -q "DEVCONTAINER MODIFIED VERSION" "$TEMP_CONFIGSET/conf/schema.xml"; then
            echo "✅ Successfully created sunspot_solr8 configset with compatible schema"
            echo "Configset contents:"
            ls -la "$TEMP_CONFIGSET/conf/"
        else
            echo "⚠️ Schema replacement may have failed"
        fi
    else
        echo "⚠️ Original sunspot configset not found at $ORIGINAL_CONFIGSET"
        echo "Available configsets:"
        ls -la /var/solr/data/configsets/ || echo "Configsets directory not found"
        CONFIGSET_LOCATION="none"
    fi
else
    echo "⚠️ Solr 8-compatible schema not found at /workspace/.devcontainer/config/schema-solr8.xml"
    echo "Will attempt to use original sunspot configset (may fail with Solr 8)"
    CONFIGSET_LOCATION="none"
fi

echo "=== Creating default core if needed ==="
if [ "$CORE_EXISTS" = "false" ]; then
    echo "Creating default core with sunspot configset..."
    
    # Initialize fallback flag
    FALLBACK_NEEDED=false
    
    # Try to create with our Solr 8-compatible configset first
    if [ "$CONFIGSET_LOCATION" = "data" ] && [ -d "/var/solr/data/configsets/sunspot_solr8" ]; then
        echo "Attempting to create core with sunspot_solr8 configset..."
        CREATE_RESULT=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST 'http://localhost:8983/solr/admin/cores?action=CREATE&name=default&configSet=sunspot_solr8')
        echo "Create result: $CREATE_RESULT"
        
        if echo "$CREATE_RESULT" | grep -q -E '(success|HTTP_CODE:200)'; then
            echo "✅ Successfully created default core with sunspot_solr8"
            FALLBACK_NEEDED=false
        else
            echo "❌ Failed to create default core with sunspot_solr8:"
            echo "$CREATE_RESULT"
            FALLBACK_NEEDED=true
        fi
    elif [ "$CONFIGSET_LOCATION" = "instancedir" ] && [ -d "/tmp/sunspot_solr8" ]; then
        echo "Attempting to create core with instanceDir pointing to temp configset..."
        # Create the core directory in Solr data and copy our config there
        CORE_DIR="/var/solr/data/default"
        mkdir -p "$CORE_DIR/conf"
        cp -r /tmp/sunspot_solr8/conf/* "$CORE_DIR/conf/"
        
        CREATE_RESULT=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "http://localhost:8983/solr/admin/cores?action=CREATE&name=default&instanceDir=$CORE_DIR")
        echo "Create result: $CREATE_RESULT"
        
        if echo "$CREATE_RESULT" | grep -q -E '(success|HTTP_CODE:200)'; then
            echo "✅ Successfully created default core with instanceDir"
            FALLBACK_NEEDED=false
        else
            echo "❌ Failed to create default core with instanceDir:"
            echo "$CREATE_RESULT"
            FALLBACK_NEEDED=true
        fi
    else
        echo "sunspot_solr8 configset not available, trying original sunspot..."
        CREATE_RESULT=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST 'http://localhost:8983/solr/admin/cores?action=CREATE&name=default&configSet=sunspot')
        echo "Create result: $CREATE_RESULT"
        
        if echo "$CREATE_RESULT" | grep -q -E '(success|HTTP_CODE:200)'; then
            echo "✅ Successfully created default core with original sunspot"
            FALLBACK_NEEDED=false
        else
            echo "❌ Failed to create default core with original sunspot:"
            echo "$CREATE_RESULT"
            FALLBACK_NEEDED=true
        fi
    fi
    
    # Fallback to _default if both sunspot attempts failed
    if [ "$FALLBACK_NEEDED" = "true" ]; then
        echo "Both sunspot configsets failed, falling back to _default..."
        
        # Copy the working _default configset to our directory if needed
        if [ -d "/opt/solr/server/solr/configsets/_default" ] && [ ! -d "/var/solr/data/configsets/_default" ]; then
            cp -r /opt/solr/server/solr/configsets/_default /var/solr/data/configsets/
            echo "Copied _default configset to /var/solr/data/configsets/"
        fi
        
        CREATE_RESULT=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST 'http://localhost:8983/solr/admin/cores?action=CREATE&name=default&configSet=_default')
        echo "Fallback create result: $CREATE_RESULT"
        if echo "$CREATE_RESULT" | grep -q -E '(success|HTTP_CODE:200)'; then
            echo "✅ Successfully created default core with _default"
            echo "⚠️  NOTE: Using _default configset instead of sunspot"
            echo "   You may need to configure the Rails app accordingly"
        else
            echo "❌ All configset attempts failed"
            echo "Available configsets:"
            find /var/solr -name "configsets" -type d -exec ls -la {} \; 2>/dev/null || true
            find /opt/solr -name "configsets" -type d -exec ls -la {} \; 2>/dev/null || true
            exit 1
        fi
    fi
else
    echo "✅ Default core already exists and is working - skipping creation"
fi

echo "=== Solr setup complete ==="
echo "Keeping Solr running (PID: $SOLR_PID)"
wait $SOLR_PID
