#!/bin/sh
set -eu

CORE_NAME="${SOLR_CORE:-blacklight-core}"
CORE_ROOT="/opt/solr/server/solr/mycores"
CORE_DIR="${CORE_ROOT}/${CORE_NAME}"

mkdir -p "${CORE_DIR}/conf"
if [ ! -f "${CORE_DIR}/conf/solrconfig.xml" ]; then
  cp -a /opt/solr-configsets/sunspot/conf/* "${CORE_DIR}/conf/"
fi
touch "${CORE_DIR}/core.properties"

# Start Solr in background (single instance)
solr start -f -p 8983 &
SOLR_PID=$!

# Wait until Solr is up
i=0
until curl -fsS "http://127.0.0.1:8983/solr/admin/info/system?wt=json" >/dev/null 2>&1; do
  i=$((i+1))
  [ "$i" -gt 60 ] && echo "Solr failed to start" && exit 1
  sleep 1
done

# Ensure core exists at the correct directory
curl -fsS "http://127.0.0.1:8983/solr/admin/cores?action=CREATE&name=${CORE_NAME}&instanceDir=${CORE_DIR}&config=solrconfig.xml&schema=schema.xml&wt=json" || true
curl -fsS "http://127.0.0.1:8983/solr/admin/cores?action=RELOAD&core=${CORE_NAME}&wt=json" || true

wait "$SOLR_PID"
