# Docker Instance Setup (Local to Production)

This runbook describes how to set up a new OHD instance locally first, then deploy it to production with the Docker-based runtime.

## Scope and assumptions

- Docker runtime uses Puma in the `app` container.
- Existing host-level Nginx reverse proxy remains in place.
- Secrets are environment-first per instance (recommended).
- `config/credentials.yml.enc` may remain in repo as compatibility fallback.

## 1. Local bootstrap

1. Create a local env file from the template:

```bash
cp .env.example .env
```

### Fresh Start (Clean-Room Reset)

Use this whenever you want to fully re-test first-time setup behavior:

```bash
docker compose --profile db down
docker volume rm ohd_db_data
docker compose --profile db up -d
```

This removes all local MariaDB data and forces first-run initialization again.

2. Set instance-specific values in `.env` (minimum):

- `OIDC_SIGNING_KEY` (RSA private key PEM; use literal `\n` if single-line)
- `OIDC_ISSUER` (for local, for example `http://portal.oral-history.localhost:3000`)
- `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD` (if using local db profile)

Notes:

- These `MYSQL_*` values are for the MariaDB container (`db` service) initialization.
- On first startup of a fresh DB volume, they create/bootstrap the database and DB user.
- If you use an external database instead of `--profile db`, you can skip `MYSQL_*` and configure Rails via `DATABASE_URL` (or `config/database.yml`).

3. Ensure required config files exist:

- `config/database.yml`
- `config/secrets.yml`
- `config/storage.yml`
- `config/datacite.yml`

4. For Docker-local DB, ensure `config/database.yml` uses host `db` (container service), not `localhost`.

5. Start services:

```bash
docker compose --profile db up -d
```

On a fresh DB volume, app startup now auto-bootstraps the development schema.

6. Optional manual database preparation (normally not needed):

```bash
docker compose --profile db exec app bundle exec rails db:prepare
```

Use this only for troubleshooting. If needed for a fully fresh instance:

```bash
docker compose --profile db exec app bundle exec rails db:create db:migrate db:seed
```

After seeding, run a quick baseline integrity check:

```bash
docker compose --profile db exec app bundle exec rake seeds:smoke
```

7. Check service state and logs:

```bash
docker compose --profile db ps
docker compose --profile db logs -f app
```

Expected result after a fresh start:

- `db` healthy
- `app` healthy
- `worker` starts after app becomes healthy

If DB credentials were changed after a previous initialization, reset only the DB volume and start again:

```bash
docker compose --profile db down
docker volume rm ohd_db_data
docker compose --profile db up -d
```

## 2. Local routing/domain setup

1. Add hosts entry:

```text
127.0.0.1 portal.oral-history.localhost
```

2. Update the project archive domain in DB:

```bash
docker compose --profile db exec app bundle exec rails runner "Project.ohd.update(archive_domain: 'http://portal.oral-history.localhost:3000')"
```

3. If you change base domains, keep backend/frontend constants in sync:

- `config/initializers/constants.rb`
- `app/javascript/modules/constants/index.js`

## 3. Local validation checklist

- App boots and serves on `http://portal.oral-history.localhost:3000`
- Login works
- Search/Solr works
- Background jobs run (`worker` healthy)
- OIDC endpoints work with configured issuer/signing key
- Restart from clean volumes succeeds (reproducibility)

## 4. Production preparation

Set per-instance production secrets (secret manager or host env):

- `OIDC_SIGNING_KEY`
- `OIDC_ISSUER`
- `DATABASE_URL` (or equivalent DB config path)
- `REDIS_URL`
- `SOLR_URL`
- `RAILS_MASTER_KEY` only if encrypted credentials are intentionally used

Important:

- Do not commit `.env`
- Do not commit `config/master.key`

## 5. Production deploy (Docker runtime)

1. Build/publish image (GHCR workflows).
2. On deploy host, ensure compose files + linked config files are present.
3. Pull and start services:

```bash
docker compose pull app worker
docker compose up -d app worker
```

4. Run migrations:

```bash
docker compose exec app bundle exec rails db:migrate
```

5. Verify health and logs:

```bash
docker compose ps
docker compose logs --tail=200 app
```

## 6. Post-deploy checks

- Tenant/domain routing works as expected
- OIDC issuer/signing key match instance URL and policy
- Worker processes queued jobs
- Solr ping/search works
- Rollback path is tested (previous image tag)

## Notes on credentials

- `config/credentials.yml.enc` is normally committed in Rails and can remain during migration.
- For Dockerized multi-instance deployments, prefer env-provided secrets.
- Remove credentials-based fallback only after all environments are validated with env-only secrets.
