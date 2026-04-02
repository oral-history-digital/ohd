# Docker Instance Setup

This runbook covers local bootstrap and production deployment for OHD using Docker Compose.

## Scope

- Runtime uses Puma in the `app` container.
- Host-level Nginx reverse proxy is used in production.
- Configuration is environment-first (`.env` / runtime env vars).
- `config/credentials.yml.enc` can remain as compatibility fallback.

## Quickstart (Local)

Docker Compose always loads `docker-compose.yml` by default.
For local development, enable local overrides once by copying the example file:

```bash
cp docker-compose.override.example.yml docker-compose.override.yml
```

After that, use regular short commands in this section (`docker compose --profile db ...`).

1. Create `.env`:

```bash
cp .env.example .env
```

2. Set minimum local values in `.env`:

```bash
MYSQL_PASSWORD_DEVELOPMENT=changeme
SECRET_KEY_BASE=<optional for dev, required for prod; 128+ hex chars>
OIDC_SIGNING_KEY=<RSA private key PEM; single-line with literal \\n is supported>
OIDC_ISSUER=http://portal.oral-history.localhost:3000
```

For local Docker bootstrap, keep test and development database names separate, but use the same local DB user/password unless you intentionally customize MariaDB users:

```bash
# Keep test DB separate (do not reuse development DB name)
MYSQL_DATABASE_DEVELOPMENT=ohd_development
MYSQL_DATABASE_TEST=ohd_test

# Match the local MariaDB user created by compose defaults
MYSQL_USER_DEVELOPMENT=ohd
MYSQL_PASSWORD_DEVELOPMENT=changeme
MYSQL_USER_TEST=ohd
MYSQL_PASSWORD_TEST=changeme
```

If `MYSQL_USER_TEST` / `MYSQL_PASSWORD_TEST` are unset, Rails falls back to `root` / `rootpassword` from `config/database.yml`, which can fail against the default local MariaDB setup.

Generate values:

```bash
# 1) SECRET_KEY_BASE (128 hex chars)
openssl rand -hex 64

# 2) OIDC_SIGNING_KEY as single-line value with literal \n (good for .env)
openssl genrsa 2048 | awk '{printf "%s\\n",$0} END{print ""}'
```

If you store `OIDC_SIGNING_KEY` on one line in `.env`, replace line breaks with literal `\n`.

3. Start stack:

```bash
docker compose --profile db up -d
```

You can observe logs using:

```bash
docker compose --profile db logs -f
```

4. Verify services:

```bash
docker compose --profile db ps
docker compose --profile db logs --tail=200 app
```

5. Initialize data (choose one):

```bash
# Option A: quick demo data
docker compose --profile db exec app bundle exec rails db:seed
```

```bash
# Option B: explicit instance bootstrap (recommended)
docker compose --profile db exec app \
	bundle exec rake "bootstrap:all[ohd,http://portal.oral-history.localhost:3000,admin@example.com,ChangeMe123?,Instance,Admin,en]"
```

`db:seed` is convenient for local testing. `bootstrap:all` is preferred when you want a predictable project/domain/admin setup.

6. Configure local domain (required for host-based routing):

Use the default local domain in examples unless you intentionally need a custom project domain.

```bash
# Add host mapping on your machine (one-time)
echo "127.0.0.1 portal.oral-history.localhost" | sudo tee -a /etc/hosts

# Verify name resolution
getent hosts portal.oral-history.localhost
```

```bash
# Set the OHD project archive domain in the database
docker compose --profile db exec app \
  bundle exec rails runner "Project.ohd.update(archive_domain: 'http://portal.oral-history.localhost:3000')"
```

```bash
# Optional: verify app responds on the configured host
curl -I http://portal.oral-history.localhost:3000
```

If you still see a "Blocked hosts" page in development, restart the app container so Rails reloads host authorization config:

```bash
docker compose --profile db restart app
```

### Using a different local domain

If you want to use a custom domain such as `portal.myarchive.localhost`:

1. Use that full URL in your bootstrap task (`http://portal.myarchive.localhost:3000`).
2. Add it to `/etc/hosts`:

```bash
echo "127.0.0.1 portal.myarchive.localhost" | sudo tee -a /etc/hosts
getent hosts portal.myarchive.localhost
```

3. If needed, set additional allowed development hosts with `OHD_EXTRA_HOSTS_DEVELOPMENT` (comma-separated), then restart app:

```bash
OHD_EXTRA_HOSTS_DEVELOPMENT=portal.myarchive.localhost docker compose --profile db up -d app
docker compose --profile db restart app
```

7. Validate baseline:

- App responds at `http://portal.oral-history.localhost:3000`
- Login works (`alice@example.com` and `Password123!` for seed data)
- Solr search works
- Worker runs background jobs

## Local Bootstrap Details

### Reset a local DB volume (clean-room)

```bash
docker compose --profile db down
docker volume rm ohd_db_data
docker compose --profile db up -d
```

Use this after changing DB credentials or when re-testing first-run initialization.

### Optional DB troubleshooting commands

```bash
docker compose --profile db exec app bundle exec rails db:prepare
docker compose --profile db exec app bundle exec rails db:create db:migrate db:seed
docker compose --profile db exec app bundle exec rake seeds:smoke
```

### Import an existing database dump

Use this when migrating an existing OHD instance into the local Docker setup.

```bash
# .sql.gz dump (recommended)
docker compose --profile db exec -e RAILS_ENV=development app \
	bundle exec rake "database:import[./path/to/dump.sql.gz]"
```

```bash
# .sql dump also works
docker compose --profile db exec -e RAILS_ENV=development app \
	bundle exec rake "database:import[./path/to/dump.sql]"
```

Behavior:

- The task prompts for confirmation before dropping a non-empty target database.
- For non-interactive runs, set `FORCE=true` to skip the prompt.
- `database:reimport` remains a devcontainer convenience task and always imports `.devcontainer/db/dump.sql.gz`.

### Recommended instance bootstrap

Prefer explicit bootstrap tasks over demo-heavy `db:seed` for real instances:

```bash
docker compose --profile db exec app \
	bundle exec rake "bootstrap:all[ohd,http://portal.oral-history.localhost:3000,admin@example.com,ChangeMe123?,Instance,Admin,en]"
```

Important: A baseline project with shortname `ohd` is currently required by parts of the app (`Project.ohd`).
Using only another shortname (for example `myarchive`) can lead to runtime errors on page load.
This will be changed in the future.

ENV-based equivalent:

```bash
docker compose --profile db exec \
	-e BOOTSTRAP_PROJECT_SHORTNAME=ohd \
	-e BOOTSTRAP_ARCHIVE_DOMAIN=http://portal.oral-history.localhost:3000 \
	-e BOOTSTRAP_ADMIN_EMAIL=admin@example.com \
	-e BOOTSTRAP_ADMIN_PASSWORD="ChangeMe123?" \
	-e BOOTSTRAP_ADMIN_FIRST_NAME=Instance \
	-e BOOTSTRAP_ADMIN_LAST_NAME=Admin \
	-e BOOTSTRAP_DEFAULT_LOCALE=en \
	app bundle exec rake bootstrap:all
```

### Solr indexing in Docker

When the app runs in containers, trigger indexing from the `app` container.

Verify Solr container status:

```bash
docker compose --profile db ps solr
```

Run a full Sunspot reindex:

```bash
docker compose --profile db exec app bundle exec rake sunspot:reindex
```

Run targeted custom reindex tasks (faster for partial updates):

```bash
# Reindex all custom model tasks + commit
docker compose --profile db exec app bundle exec rake solr:reindex:all

# Reindex only segments
docker compose --profile db exec app bundle exec rake solr:reindex:segments

# Reindex only interviews
docker compose --profile db exec app bundle exec rake solr:reindex:interviews

# Commit pending index changes
docker compose --profile db exec app bundle exec rake solr:reindex:commit

# Limit to one Project and a given number of items
docker compose --profile db exec app bundle exec rake solr:reindex:scoped PROJECT_SHORTNAME=za LIMIT=10 WITH_RELATED=true
```

Tip: use `sunspot:reindex` for complete rebuilds and `solr:reindex:*` for incremental maintenance.


## Environment Variables

Use `.env.example` as the baseline app-variable reference.

### Production critical (must set)

- `SECRET_KEY_BASE`
- `OIDC_SIGNING_KEY`
- `OIDC_ISSUER`
- `MYSQL_HOST_PRODUCTION`
- `MYSQL_USER_PRODUCTION`
- `MYSQL_PASSWORD_PRODUCTION`
- `MYSQL_DATABASE_PRODUCTION`
- `DATACITE_CLIENT_ID_PRODUCTION`
- `DATACITE_PASSWORD_PRODUCTION`

### Production recommended

- `OHD_DOMAIN_PRODUCTION`
- `STORAGE_PROD_ROOT`
- `RAILS_MAX_THREADS` (default `5`)

### Runtime/infrastructure (compose/orchestrator)

- `REDIS_URL`
- `SOLR_URL`

### Optional

- `ALLOW_LOCALHOST_IN_PRODUCTION` (default `false`)
- `OHD_EXTRA_HOSTS_DEVELOPMENT` (comma-separated hostnames)
- `OHD_EXTRA_HOSTS_STAGING` (comma-separated hostnames)
- `OHD_EXTRA_HOSTS_PRODUCTION` (comma-separated hostnames)
- `ACTIVE_RECORD_ENCRYPTION_*`

## Staging-Like Deployment

Current Docker runtime uses `RAILS_ENV=production`. For staging, use staging endpoints/secrets with production-scoped variable names expected by mounted configs.

```bash
RAILS_ENV=production
MYSQL_HOST_PRODUCTION=db.staging.internal
MYSQL_USER_PRODUCTION=ohd_staging
MYSQL_PASSWORD_PRODUCTION=<secure password>
MYSQL_DATABASE_PRODUCTION=ohd_staging
STORAGE_STAGING_ROOT=/mnt/staging/ohd/storage
OHD_DOMAIN_STAGING=https://staging.oral-history.digital
OIDC_SIGNING_KEY=<RSA key>
OIDC_ISSUER=https://staging.oral-history.digital
SECRET_KEY_BASE=<generate with `rails secret`>
```

## Production Deploy

1. Ensure compose files and linked config mounts exist on host.
2. Pull and start runtime services:

```bash
docker compose -f docker-compose.yml pull app worker
docker compose -f docker-compose.yml up -d app worker
```

3. Run migrations:

```bash
docker compose -f docker-compose.yml exec app bundle exec rails db:migrate
```

4. Verify:

```bash
docker compose -f docker-compose.yml ps
docker compose -f docker-compose.yml logs --tail=200 app
```

5. Post-deploy checks:

- Domain routing works
- OIDC issuer/signing key match instance URL
- Worker processes jobs
- Solr ping/search works

## Host Setup (Production)

### Prerequisites

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release nginx certbot python3-certbot-nginx
```

- Install Docker Engine and Compose plugin (official Docker docs for your distro).
- Open ports `22/tcp`, `80/tcp`, `443/tcp`.

### Nginx reverse proxy example

`/etc/nginx/sites-available/ohd.conf`:

```nginx
server {
	listen 80;
	server_name portal.example.org;

	location / {
		proxy_pass http://127.0.0.1:3000;
		proxy_http_version 1.1;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_read_timeout 300;
		proxy_send_timeout 300;
	}
}
```

Enable and validate:

```bash
sudo ln -s /etc/nginx/sites-available/ohd.conf /etc/nginx/sites-enabled/ohd.conf
sudo nginx -t
sudo systemctl reload nginx
```

Issue certificate:

```bash
sudo certbot --nginx -d portal.example.org
```

## Config Mapping Reference

- `config/database.yml` uses: `MYSQL_*_DEVELOPMENT`, `MYSQL_*_TEST`, `MYSQL_*_PRODUCTION`.
- `config/datacite.yml` uses: `DATACITE_*_DEVELOPMENT`, `DATACITE_*_TEST`, `DATACITE_*_PRODUCTION`.
- `config/storage.yml` uses: `STORAGE_DEV_ROOT`, `STORAGE_TEST_ROOT`, `STORAGE_STAGING_ROOT`, `STORAGE_PROD_ROOT`.
- `config/initializers/constants.rb` uses: `OHD_DOMAIN` and `OHD_DOMAIN_<ENV>`.
- `config/secrets.yml` reads `SECRET_KEY_BASE` for production.

## Security Notes

- Do not commit `.env`.
- Do not commit `config/master.key`.
- Inject secrets at runtime (env vars / secret manager).
