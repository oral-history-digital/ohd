# Kamal deployment guide (OHD)

OHD is deployed with **kamal-podman**, the Podman fork of Kamal (gem `kamal_podman`
on top of Kamal 2.12). Use the repository wrapper:

```bash
bin/kamal <command> -d <destination>
```

The wrapper creates Kamal's required, ignored `config/deploy.<destination>.yml`
with no instance settings. Load the selected instance's environment before each command.

Do not use plain `kamal`. It targets Docker, and the servers only run Podman.

This guide covers:

- files and structure
- prerequisites and secrets
- setting up a new server (bootstrap)
- deploys, console and logs
- accessories (DB, Solr)
- reboots and autostart
- adding another server
- troubleshooting

---

## 1) Files and structure

| File | Purpose |
|---|---|
| `config/deploy.yml` | Shared config. Reads host, SSH user, domain, storage directory, and database settings from the selected instance's environment. |
| `bin/kamal` | Creates the empty destination file Kamal requires and runs `kamal-podman`. |
| `.kamal/secrets-common` | Maps the selected instance's environment variables to Kamal secrets. |
| `bin/server/bootstrap` | Sets up the server(s) of a destination over SSH. Safe to re-run. |
| `bin/server/remote-bootstrap.sh` | The part that runs on the server. Called by `bin/server/bootstrap`. |
| `bin/server/podman-autostart.sh` | Installed on the server as `~/bin/podman-autostart.sh`. Starts the containers after a reboot. |
| `bin/server/layout.rb` | Renders the config and prints the hosts and host directories. Use it to check what the bootstrap will do. |
| `bin/server/README.md` | Short version of this section for new servers. |
| `Dockerfile` | App image. Runtime user `appuser` has UID/GID 1000. |
| `Dockerfile.base` | Shared base image (system packages, Node, Yarn). |
| `Dockerfile.solr`, `docker/solr/init-core.sh` | Solr image with the Sunspot configset and idempotent core init. |

Remove `.kamal/hooks/pre-setup/*` and any `docker`-based setup scripts from older
versions of this guide. They are no longer used.

---

## 2) Prerequisites

**Local machine**

- Ruby and Bundler, with the repo's gems installed (`bundle install`)
- Podman. The builder runs `podman build` and `podman push`.
- SSH access to the server, for example via `~/.ssh/config` (the `avd-stag` alias)
- GitHub Container Registry credentials (see section 3)

**Server**

- Debian or Ubuntu with `apt`
- A deploy user (e.g. `avd1`) with SSH access and temporary passwordless `sudo` for bootstrap
- Nothing else. `bin/server/bootstrap` installs Podman and everything it needs.
  Docker is not used.

---

## 3) Environment variables (local)

Load the selected instance's private environment before each bootstrap or Kamal command.
Use `.env.example` for the variable names. Kamal requires `DEPLOY_HOST`,
`DEPLOY_SSH_USER`, `DEPLOY_DOMAIN`, `DEPLOY_STORAGE_DIR`, `MYSQL_DATABASE`,
`MYSQL_USER`, `DATACITE_PREFIX`, `DATACITE_CLIENT_ID`, and `DATACITE_URL`.
Set `DEPLOY_HOST` to a DNS name or IP address reachable from the deployment
environment. Set `DEPLOY_SSH_KEY` to the private key path in that environment
when the key is not available through its SSH agent or SSH config. In the deploy
devcontainer, set `SSH_KEY_PATH` in `.devcontainer/deploy/.env` to the key's host
path and set `DEPLOY_SSH_KEY=/root/.ssh/id_deploy` in the selected instance's
environment. Recreate the devcontainer after changing the mounted key.
The storage directory must be an absolute server path. Active Storage uses
`/app/storage` inside the container and the `uploads` directory under the host
storage path.

The registry also reads:

- `GITHUB_ACTOR`: GitHub user for GHCR
- `GITHUB_TOKEN`: token with `read:packages` (`write:packages` if you push images)

`DEPLOY_ARCH` defaults to `amd64`. Set `OHD_EXTRA_HOSTS` for additional
accepted hostnames. The destination name passed with `-d` identifies the deployment;
the host and application values come from the loaded environment.

---

## 4) Secrets

Load the selected instance's environment before running Kamal. Kamal reads
`.kamal/secrets-common` for every destination.

The environment must provide every secret referenced in the config:

- `RAILS_MASTER_KEY`
- `MYSQL_PASSWORD`
- `OIDC_SIGNING_KEY`
- `SECRET_KEY_BASE`
- `MARIADB_ROOT_PASSWORD`
- `MARIADB_PASSWORD` (mapped from `MYSQL_PASSWORD` by `.kamal/secrets-common`)
- `DATACITE_PASSWORD`
- `ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY`, `ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY`,
  and `ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT` for OTP authentication

> Do not commit files that contain plaintext secrets.

---

## 5) Set up a server (bootstrap)

```bash
bin/server/bootstrap avd-staging
```

The bootstrap reads the destination config, then connects to each host over SSH and:

- installs `podman uidmap slirp4netns cron` (and `passt` if available)
- adds the subuid/subgid range for the deploy user if it is missing
- allows rootless ports from 80 (sysctl)
- creates `/run/user/<uid>` at every boot and makes `/` shared (root's crontab)
- creates the host directories for volumes and accessories, and sets the owner the
  container expects inside its user namespace:

  | Container path | Container user | Used by |
  |---|---|---|
  | `/var/lib/mysql` | 999 (mysql) | DB accessory |
  | `/opt/solr/...` | 8983 (solr) | Solr accessory |
  | `/app/...` | 1000 (appuser) | web and job containers |

- installs `~/bin/podman-autostart.sh` and starts it at boot (user's crontab)
- clears Podman state left over from a reboot

The bootstrap is idempotent. Run it again after changing volumes, accessory
directories or the autostart script. It only changes what is missing or wrong.

To see what it will do without touching a server:

```bash
ruby bin/server/layout.rb avd-staging
```

> `bin/server/bootstrap` replaces Kamal's own `kamal-podman server bootstrap`, which
> only checks that Podman is installed.

---

## 6) Setup and deploy

Run bootstrap from your workstation while the deploy user has passwordless sudo.

```bash
bin/server/bootstrap avd-staging
```

After bootstrap succeeds, revoke the deploy user's temporary sudo access. Run the
first deployment to start the accessories, proxy, and app.

```bash
bin/kamal setup -d avd-staging
```

Use `bin/kamal deploy -d avd-staging` for subsequent releases.

### Nginx and HTTPS

Nginx owns ports 80 and 443 and serves the ACME certificate. Kamal's HTTP
proxy listens only on `127.0.0.1:8080`; it does not need certificate secrets.
Configure the Nginx HTTPS server block to forward requests to it:

```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Set up Nginx and ACME separately on the server. Confirm that Nginx can connect
to `127.0.0.1:8080` after Kamal setup.

---

## 7) Day-2 commands

```bash
# deploy the current commit
bin/kamal deploy -d avd-staging

# Rails console and shell in the app container (aliases from deploy.yml)
bin/kamal console -d avd-staging
bin/kamal shell -d avd-staging

# web and job logs
bin/kamal logs -d avd-staging          # alias for app logs -f
bin/kamal joblogs -d avd-staging       # alias for app logs -r job -f

# status
bin/kamal app containers -d avd-staging
bin/kamal app details -d avd-staging
bin/kamal app version -d avd-staging
```

Use the current container names from `app containers`. App containers are versioned.

---

## 8) Accessories (DB, Solr)

```bash
bin/kamal accessory details -d avd-staging solr
bin/kamal accessory logs -d avd-staging db
bin/kamal accessory reboot -d avd-staging solr   # stop, remove, start
bin/kamal accessory restart -d avd-staging db
```

Accessory data lives in the remote home, not in the repo:

- DB: `~/ohd-db/data`
- Solr: `~/ohd-solr/solr_data`

> **Destructive:** `accessory remove` deletes the accessory's container and image and
> runs `rm -rf ~/<service>-<accessory>`. That includes the data. Dump the database
> first (e.g. `mysqldump`) and make sure you have a copy before you run it.

```bash
bin/kamal accessory remove -d avd-staging solr
bin/kamal accessory boot -d avd-staging solr
```

---

## 9) Reboots and autostart

The servers have no systemd. Autostart uses cron:

- **Root's crontab** (set up by the bootstrap) runs at every boot:
  - `mkdir -p /run/user/<uid>` with owner and mode, because `/run` is cleared on boot
  - `mount --make-rshared /`, which Podman needs for mounts
- **The deploy user's crontab** runs at every boot after 30 s:
  `~/bin/podman-autostart.sh`

The autostart script:

1. Waits for `/run/user/<uid>`.
2. If Podman refuses to run because of the previous boot (`boot ID differs`), deletes
   the Podman runtime state it names and runs `podman system migrate`.
3. Removes overlay leftovers (`work/work`) of stopped containers.
4. Starts the accessories (DB, Solr), waits 15 s.
5. Starts `kamal-proxy`.
6. Starts the app and job containers (not the `*_replaced_*` leftovers).

Logs:

- `~/log/podman-autostart.log`: what the script did
- `~/log/podman-autostart.cron.log`: cron output

The script can be run by hand while containers are running. It only starts containers
that are stopped and does not stop anything:

```bash
ssh avd-stag 'bash ~/bin/podman-autostart.sh; tail -20 ~/log/podman-autostart.log'
```

> Do not run `podman system migrate` by hand while containers are running. It stops
> them all. The autostart script only runs it right after a reboot.

After a reboot, check the state:

```bash
ssh avd-stag 'podman ps -a --format "{{.Names}} {{.Status}}"'
```

---

## 10) Job role

The job worker is a separate role in the destination file:

```yaml
servers:
  web:
    - "<%= host_ip %>"
  job:
    hosts:
      - "<%= host_ip %>"
    cmd: bundle exec rake jobs:work
```

Check job logs:

```bash
bin/kamal app logs -d avd-staging -r job -f
```

---

## 11) Deploy an existing image tag

If the image is already in GHCR, deploy it without rebuilding:

```bash
bin/kamal deploy -d avd-staging --version 9f309618fb6335e01c530b27c9c24d5d44181016 --skip-push
bin/kamal deploy -d avd-staging --version latest -P
```

To redeploy the running version without running the bootstrap again, use
`kamal-podman redeploy`.

---

## 12) Another server (instance)

1. Create a private environment for the instance with the values in sections 3 and 4.
2. Enable SSH access for its deploy user.
3. Load that environment and follow [Setup and deploy](#6-setup-and-deploy) with
   its destination name.

---

## 13) Solr notes

- The app must use `SOLR_URL=http://ohd-solr:8983/solr/blacklight-core`. This is set in
  `config/deploy.yml`.
- The Solr accessory uses the custom image `ghcr.io/oral-history-digital/ohd-solr` with
  the Sunspot configset.
- The Solr data directory must be owned by UID 8983 in the container's user namespace.
  The bootstrap sets this.
- If Solr crash-loops, check its logs:

  ```bash
  bin/kamal accessory logs -d avd-staging solr
  # or on the server:
  ssh avd-stag 'podman logs --tail 200 ohd-solr'
  ```

---

## 14) Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `current system boot ID differs from cached boot ID` | Podman state from before a reboot | Run `bin/server/bootstrap <dest>`. The autostart script also clears this after a reboot. |
| `unable to start container ... work/work/incompat: permission denied` | Overlay leftovers from an unclean shutdown | The autostart script removes them for stopped containers. Start the container again after the script has run, or run it by hand (section 9). |
| `Operating system error number 13` / `Permission denied` in the MariaDB log | Data directory owned by the wrong UID in the namespace | Run `bin/server/bootstrap <dest>`. Check with `podman unshare stat -c '%u:%g' ~/ohd-db/data` (expect `999:999`). |
| Solr cannot write its data | Wrong owner on `~/ohd-solr/solr_data` | As above, expect `8983:8983`. |
| App cannot write to `tmp/` or `log/` | Wrong owner on app volumes | As above, expect `1000:1000` on `app-cache`, `app-files` and `app-logs`. |
| `rootlessport listen tcp 127.0.0.1:8080: address already in use` | Something else listens on port 8080 | Check listeners with `ss -ltnp` on the server and free port 8080. |
| `"/" is not a shared mount` | Mount propagation of `/` | The root crontab fixes it at boot. Apply it now: `sudo mount --make-rshared /`. |
| `XDG_RUNTIME_DIR is ... not /run/user/<uid>` (bootstrap warning) | SSH sessions do not export the runtime dir, so Podman uses a different one | Export `XDG_RUNTIME_DIR=/run/user/<uid>` for non-interactive sessions, e.g. in `~/.pam_environment`. Then re-run the bootstrap. |
| Containers are down after a reboot | Autostart did not finish or failed | `~/log/podman-autostart.log` and `~/log/podman-autostart.cron.log` on the server. Then run `bash ~/bin/podman-autostart.sh`. |
| `kamal-podman setup` says Podman is not installed | Bootstrap has not run on this server | Run `bin/server/bootstrap <dest>` first. |
| `docker: command not found` or Docker errors | Plain `kamal` was used | Use `bin/kamal`. |
| `docker exec` / `docker logs` fail | Old commands | Use `podman` on the server, or `bin/kamal ... logs`. |
| Wrong container name in `exec` | App containers are versioned | Use `bin/kamal app containers -d <dest>`. |

---

## 15) Recommended workflow for a new instance

1. Create and load the instance's private environment using sections 3 and 4.
2. Export `GITHUB_ACTOR` and `GITHUB_TOKEN`.
3. Follow [Setup and deploy](#6-setup-and-deploy) with the new destination name.

4. Reboot the server in a maintenance window and check
   `~/log/podman-autostart.log` and `podman ps -a`.
