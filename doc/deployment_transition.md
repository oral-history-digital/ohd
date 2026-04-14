# Deployment Transition (Legacy + Docker)

This guide covers the interim phase where both deployment paths are available for OHD:

- Legacy source-based Capistrano deploy
- Docker-based Capistrano deploy

For the step-by-step rollout sequence, see `doc/deployment_transition_plan.md`.

Scope: `ohd_archive` and `ohd_archive_staging` stages.

## What is currently possible

Both paths are available in this branch:

- Legacy: `bundle exec cap <stage> deploy`
- Docker: `bundle exec cap <stage> docker:deploy`

Examples:

```bash
bundle exec cap ohd_archive_staging deploy
bundle exec cap ohd_archive_staging docker:deploy
```

```bash
bundle exec cap ohd_archive deploy
bundle exec cap ohd_archive docker:deploy
```

Important:

- Do not alternate both paths on the same target instance without a planned handover.
- Legacy uses release symlinks/linked files; Docker uses `docker-compose.yml` and container runtime mounts.

## Required changes for legacy deploy (env-first migration)

For legacy deploy, these values must now be provided via environment variables on the target host/runtime.

Capistrano now loads a stage-specific host env file:

- `ohd_archive`: `/data/applications/ohd_archive/shared/config/deploy.env`
- `ohd_archive_staging`: `/data/applications/ohd_archive_staging/shared/config/deploy.env`

Use standard env-file lines (`KEY=value`) in these files.

### Required for staging (`ohd_archive_staging`)

```bash
SECRET_KEY_BASE=
OIDC_SIGNING_KEY=
OIDC_ISSUER=

MYSQL_HOST_STAGING=
MYSQL_DATABASE_STAGING=
MYSQL_USER_STAGING=
MYSQL_PASSWORD_STAGING=

DATACITE_CLIENT_ID_STAGING=
DATACITE_PASSWORD_STAGING=
```

### Required for production (`ohd_archive`)

```bash
SECRET_KEY_BASE=
OIDC_SIGNING_KEY=
OIDC_ISSUER=

MYSQL_HOST_PRODUCTION=
MYSQL_DATABASE_PRODUCTION=
MYSQL_USER_PRODUCTION=
MYSQL_PASSWORD_PRODUCTION=

DATACITE_CLIENT_ID_PRODUCTION=
DATACITE_PASSWORD_PRODUCTION=
```

## Optional but recommended vars

Set these explicitly to avoid relying on defaults:

- `OHD_DOMAIN_STAGING` / `OHD_DOMAIN_PRODUCTION`
- `STORAGE_STAGING_ROOT` / `STORAGE_PROD_ROOT`
- `RAILS_MAX_THREADS`

Optional host tuning:

- `OHD_EXTRA_HOSTS_STAGING` / `OHD_EXTRA_HOSTS_PRODUCTION`
- `ALLOW_LOCALHOST_IN_PRODUCTION=true` (only for controlled smoke tests)

## Quick verification after deploy

For both paths:

1. App boots and serves the expected host/domain.
2. Worker is running and jobs are processed.
3. Database connectivity works.
4. DataCite actions can authenticate (if used in this instance).

For Docker path, `docker:deploy` already includes migration and verification steps.
