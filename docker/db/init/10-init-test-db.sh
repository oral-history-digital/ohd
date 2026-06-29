#!/bin/sh
set -eu

TEST_DB="${MYSQL_TEST_DATABASE:-ohd_test}"
APP_USER="${MYSQL_USER:-ohd}"
APP_PASS="${MYSQL_PASSWORD:-}"

if [ -z "$APP_PASS" ]; then
  echo "Skipping test DB grant setup: MYSQL_PASSWORD is empty"
  exit 0
fi

mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" <<-EOSQL
  CREATE DATABASE IF NOT EXISTS \`${TEST_DB}\`;
  CREATE USER IF NOT EXISTS '${APP_USER}'@'%' IDENTIFIED BY '${APP_PASS}';
  GRANT ALL PRIVILEGES ON \`${TEST_DB}\`.* TO '${APP_USER}'@'%';
  FLUSH PRIVILEGES;
EOSQL
