# Kamal deployment guide (OHD)

This guide documents how to run and operate OHD with Kamal, including:

- initial setup
- deploys
- console/logs
- accessory lifecycle (DB/Solr)
- required environment variables/secrets
- what to change when creating another instance
- how to deploy a prebuilt image tag

---

## 1) Files and structure

- `config/deploy.yml`  
  Shared/base Kamal config across environments.
- `config/deploy.avd-staging.yml`  
  Instance-specific overrides (host/IP/domain/volumes/accessories).
- `.kamal/secrets.avd-staging`  
  Instance-specific secrets loaded by Kamal.
- `.kamal/hooks/pre-setup/01-bootstrap-host-dirs.sh`  
  Host directory bootstrap (permissions + required directories).
- `Dockerfile`  
  App image build (runtime user UID/GID 1000).
- `Dockerfile.solr` + `docker/solr/init-core.sh`  
  Custom Solr image and idempotent core init.

---

## 2) One-time prerequisites

On your local machine:

- Docker available
- Kamal installed (`bundle exec kamal` or `kamal`)
- SSH access to server
- GitHub Container Registry credentials (`GITHUB_ACTOR`, `GITHUB_TOKEN`)

On target server:

- SSH user has sudo rights (needed by pre-setup hook)
- Kamal setup will install/configure Docker if needed

---

## 3) Required environment variables (local, before running Kamal)

These are read from your shell/.env when Kamal renders ERB and authenticates registry:

- `GITHUB_ACTOR` (GH username/org automation user)
- `GITHUB_TOKEN` (GHCR read token; write token if pushing)

Recommended (to avoid hardcoding paths/users):

- `KAMAL_SSH_USER` (e.g. `avd1`)
- `KAMAL_STORAGE_BASE` (e.g. `/home/avd1/avd/storage`)

Optional UID/GID overrides for hooks:

- `APP_UID` (default `1000`)
- `APP_GID` (default `1000`)
- `SOLR_UID` (default `8983`)
- `SOLR_GID` (default `8983`)

---

## 4) Secrets file (`.kamal/secrets.avd-staging`)

Must include all secrets referenced in `deploy.yml` and accessory env:

- `RAILS_MASTER_KEY`
- `MYSQL_PASSWORD_PRODUCTION`
- `OIDC_SIGNING_KEY`
- `SECRET_KEY_BASE`
- `MARIADB_ROOT_PASSWORD`
- `MARIADB_PASSWORD`
- `CERTIFICATE_PEM` (if using inline proxy ssl)
- `PRIVATE_KEY_PEM` (if using inline proxy ssl)

> Keep this file out of git if it contains plaintext secrets.

---

## 5) First setup on a new instance

Run:

```bash
kamal setup -d avd-staging
```

What this does:

- runs pre-setup hooks (`.kamal/hooks/pre-setup/*`)
- prepares proxy/network
- starts accessories
- prepares app runtime

Then deploy app:

```bash
kamal deploy -d avd-staging
```

---

## 6) Day-2 commands (operations)

### Deploy latest commit (normal flow)

```bash
kamal deploy -d avd-staging
```

### Open Rails console

```bash
kamal console -d avd-staging
```

### Open shell in app container

```bash
kamal shell -d avd-staging
```

### Tail web logs

```bash
kamal logs -d avd-staging -f
```

### Tail job logs

```bash
kamal joblogs -d avd-staging
# or:
kamal app logs -d avd-staging -r job -f
```

### Show running app containers/details

```bash
kamal app details -d avd-staging
```

---

## 7) Rebooting/recreating accessories

### Restart only Solr accessory

```bash
kamal accessory boot -d avd-staging solr
```

### Restart only DB accessory

```bash
kamal accessory boot -d avd-staging db
```

### Remove + recreate an accessory (destructive for that accessory data dir)

```bash
kamal accessory remove -d avd-staging solr
kamal accessory boot -d avd-staging solr
```

> `accessory remove` removes container/image and attempts to remove accessory data dirs.

---

## 8) Delayed Job role

Define a `job` server role in `config/deploy.avd-staging.yml`:

```yaml
servers:
  web:
    - 160.45.152.195
  job:
    hosts:
      - 160.45.152.195
    cmd: bundle exec bin/delayed_job run
```

Then deploy:

```bash
kamal deploy -d avd-staging
```

Check job logs:

```bash
kamal app logs -d avd-staging -r job -f
```

---

## 9) Deploy an already built image tag

If image is already in GHCR, deploy without rebuilding:

Example:

```bash
kamal deploy -d avd-staging --version 9f309618fb6335e01c530b27c9c24d5d44181016 --skip-push
kamal deploy -d avd-staging --version latest -P
```

---

## 10) What to change for another instance

When cloning staging config to a new instance, update these fields.

### In `config/deploy.<instance>.yml`

- `servers.web` IP(s)
- `servers.job.hosts` IP(s) (if used)
- `proxy.host` domain
- `env.clear.OHD_DOMAIN_PRODUCTION`
- `env.clear.OHD_DOMAIN`
- `env.clear.OHD_EXTRA_HOSTS_PRODUCTION` (if needed)
- `ssh.user`
- `volumes` host paths (or set via `KAMAL_STORAGE_BASE`)
- accessory hosts under `accessories.db.hosts`, `accessories.solr.hosts`
- any instance-specific flags (`SENTRY_DISABLED`, timezone if needed)

### In `.kamal/secrets.<instance>`

- all environment-specific secret values:
  - Rails master key
  - DB passwords
  - OIDC key
  - secret_key_base
  - TLS cert/private key (if inline)
  - any external API credentials

---

## 11) Solr notes (important)

- App must use:
  - `SOLR_URL=http://ohd-solr:8983/solr/blacklight-core`
- Solr accessory should be on custom image that contains Sunspot configset.
- Solr data dir ownership must allow UID `8983`.
- If Solr crash-loops, first check:
  ```bash
  docker logs --tail=200 ohd-solr
  ```

---

## 12) Troubleshooting quick checks

### App cannot reach Solr (`getaddrinfo` / connection refused)

1. Check Solr running:
   ```bash
   docker ps --format '{{.Names}} {{.Status}}' | grep '^ohd-solr'
   ```
2. If down/restarting, inspect logs:
   ```bash
   docker logs --tail=200 ohd-solr
   ```
3. Reboot accessory:
   ```bash
   kamal accessory boot -d <instance> solr
   ```

### Permission denied on bind mounts

Run setup hook path logic again via:

```bash
kamal setup -d <instance>
```

(or fix manually with `sudo chown/chmod` on host paths)

### Wrong container name during `docker exec`

Always use current name from `docker ps` (Kamal app containers are versioned).

---

## 13) Recommended instance template workflow

For each new instance:

1. copy `deploy.avd-staging.yml` -> `deploy.<new>.yml`
2. edit instance-specific values listed above
3. create `.kamal/secrets.<new>`
4. export required env vars (`GITHUB_*`, optional `KAMAL_*`)
5. run:
   ```bash
   kamal setup -d <new>
   kamal deploy -d <new>
   ```

This yields repeatable, low-manual deployment with app + accessories.
