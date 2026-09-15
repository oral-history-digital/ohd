#!/bin/sh
set -eu

CORE_NAME="${SOLR_CORE:-blacklight-core}"
CORE_ROOT="/opt/solr/server/solr/mycores"
CORE_DIR="${CORE_ROOT}/${CORE_NAME}"

mkdir -p "${CORE_DIR}"
if [ ! -f "${CORE_DIR}/solrconfig.xml" ] && [ ! -f "${CORE_DIR}/conf/solrconfig.xml" ]; then
  mkdir -p "${CORE_DIR}/conf"
  cp -a /opt/solr-configsets/sunspot/conf/* "${CORE_DIR}/conf/"
fi
touch "${CORE_DIR}/core.properties"

# Start solr in background to call Core Admin
solr start
sleep 3

# create if missing; ignore if already exists
curl -fsS "http://127.0.0.1:8983/solr/admin/cores?action=CREATE&name=${CORE_NAME}&instanceDir=${CORE_DIR}&config=solrconfig.xml&schema=schema.xml&wt=json" || true
curl -fsS "http://127.0.0.1:8983/solr/admin/cores?action=RELOAD&core=${CORE_NAME}&wt=json" || true

# keep foreground
exec solr-fg
