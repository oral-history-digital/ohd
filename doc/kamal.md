# Kamal deployment guide (OHD)

OHD is deployed with **kamal-podman**, the Podman fork of Kamal (gem `kamal_podman`
on top of Kamal 2.12). Use the repository wrapper:

```bash
bin/kamal <command> -d <destination>
```

The wrapper loads `.env.kamal.<destination>` and creates Kamal's required,
ignored `config/deploy.<destination>.yml` with no instance settings.

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
| `config/deploy.yml` | Shared config. Reads host, SSH user, domain, storage, database, and proxy ports from the selected instance's environment. |
| `bin/kamal` | Loads the selected instance's environment, creates the empty destination file Kamal requires, and runs `kamal-podman`. |
| `.env.kamal.<destination>` | Private, ignored environment file for one instance. |
| `.kamal/secrets-common` | Maps the selected instance's environment variables to Kamal secrets. |
| `bin/server/bootstrap` | Sets up the server(s) of a destination over SSH. Safe to re-run. |
| `bin/server/remote-bootstrap.sh` | The part that runs on the server. Called by `bin/server/bootstrap`. |
| `bin/server/podman-autostart.sh` | Installed on the server as `~/bin/podman-autostart.sh`. Starts the containers after a reboot. |
| `bin/server/layout.rb` | Renders the config and prints the hosts and host directories. Use it to check what the bootstrap will do. |
| `bin/server/README.md` | Short version of this section for new servers. |
| `Dockerfile` | App image. Runtime user `appuser` has UID/GID 1000. |
| `Dockerfile.base` | Shared base image (system packages, Node, Yarn). |

---

## 2) Prerequisites

**Local machine**

- Ruby and Bundler, with the repo's gems installed (`bundle install`)
- Podman only when building and pushing an image locally. CI-built images use
  `--skip-push` and do not require Podman in the deploy devcontainer.
- SSH access to the server as the instance's deploy user
- GitHub Container Registry credentials (see section 3)

**Server**

- Debian or Ubuntu with `apt`
- A separate deploy user for each instance, with SSH access and temporary passwordless `sudo` for bootstrap
- Nothing else. `bin/server/bootstrap` installs Podman and everything it needs.
  Docker is not used.

---

## 3) Environment variables (local)

Create `.env.kamal.<destination>` in the repository root for each instance.
Keep it private (`chmod 600`); `bin/kamal` and `bin/server/bootstrap` load it
automatically. Use `.env.example` for the variable names. Kamal requires `DEPLOY_HOST`,
`DEPLOY_SSH_USER`, `DEPLOY_DOMAIN`, `DEPLOY_STORAGE_DIR`, `MYSQL_DATABASE`,
`MYSQL_USER`, `DATACITE_PREFIX`, `DATACITE_CLIENT_ID`, and `DATACITE_URL`.
Set `DEPLOY_HOST` to a DNS name or IP address reachable from the deployment
environment. Set `DEPLOY_SSH_KEY` to the private key path in that environment
when the key is not available through its SSH agent or SSH config. Both
`bin/kamal` and `bin/server/bootstrap` use this value. For the deploy
devcontainer, set `DEPLOY_KEYS_DIR` in `.devcontainer/deploy/.env` to the host
directory containing your keys. Set `DEPLOY_SSH_KEY` in the instance environment
to the key's path *inside* the devcontainer; check it with
`test -r "$DEPLOY_SSH_KEY"` from the same shell used for deployment. Recreate the
devcontainer after changing the directory mount.
The storage directory must be an absolute server path. Active Storage uses
`/app/storage` inside the container. Kamal mounts `files`, `logs`, `tmp/cache`,
and `tmp/files` beneath the host storage path into both app roles. Keep the
remaining `/app/tmp` contents, including Puma PID and socket files, ephemeral.

The registry also reads:

- `GITHUB_ACTOR`: GitHub user for GHCR
- `GITHUB_TOKEN`: token with `read:packages` (`write:packages` if you push images)

`DEPLOY_ARCH` defaults to `amd64`. Set `OHD_EXTRA_HOSTS` for additional
accepted hostnames. The destination name passed with `-d` identifies the deployment;
the host and application values come from the loaded environment.
`DEPLOY_RAILS_ENV` defaults to `production`; set it to `staging` for a Rails
staging instance. Kamal passes this value to the app container as `RAILS_ENV`
and `RACK_ENV`, independent of the deploy devcontainer's own environment.
`DEPLOY_PROXY_HTTP_PORT` and `DEPLOY_PROXY_HTTPS_PORT` default to `8080` and
`8443`. Give each destination on the same server its own pair of host ports;
for example, set them to `8084` and `8448` in `.env.kamal.avd-staging` when
another service user already uses the defaults. Nginx forwards to the HTTP port.

---

## 4) Secrets

The wrapper loads the selected instance's environment before Kamal reads
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

The host port sysctl allows rootless containers to publish low host ports, such
as Nginx on 80 and 443. Kamal's high host ports do not need it. The separate
`proxy.run.options.sysctl` lets the proxy process bind port 80 *inside* its
container.

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

Follow [the server bootstrap guide](../bin/server/README.md) to enable the
deploy user's SSH key and temporary passwordless sudo. Run bootstrap from the
deploy environment:

```bash
bin/server/bootstrap avd-staging
```

After bootstrap succeeds, revoke the deploy user's temporary sudo access. Run the
first deployment with a published image tag to start the accessories, proxy,
and app:

```bash
bin/kamal setup -d avd-staging --version v2.13.2 --skip-push
```

On a fresh, empty MariaDB database, the first setup starts the accessories but
the web container cannot boot until the schema exists. After that first setup
attempt, load the schema once and retry setup with the same image tag:

```bash
IMAGE_TAG=v2.13.2 # Replace with the tag used for the first setup.
bin/kamal app exec --primary -d avd-staging --version "$IMAGE_TAG" "bin/rails db:schema:load"
bin/kamal setup -d avd-staging --version "$IMAGE_TAG" --skip-push
```

Do not run `db:schema:load` on a populated database. It replaces existing tables.

If you will import an existing database, do that instead of loading the empty
schema. After the database is ready, use `bin/kamal deploy` with a published
image tag and `--skip-push` for subsequent releases.

### Nginx and HTTPS

Run one Nginx container under a separate `webproxy` user, with host networking
and ports 80 and 443. Give each hostname its own HTTPS server block and forward
it to that instance's localhost Kamal HTTP port. Nginx terminates TLS; Kamal's
HTTPS port is unused. The Kamal proxy binds port 80 inside its own network
namespace through the `proxy.run.options.sysctl` setting in `config/deploy.yml`.
For an instance using `DEPLOY_PROXY_HTTP_PORT=8084`, its Nginx location is:

```nginx
location / {
    proxy_pass http://127.0.0.1:8084;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
}
```

The forwarded `Host` must match the destination's `DEPLOY_DOMAIN`; Rails also
uses the forwarded HTTPS scheme for domain routing. If you temporarily serve
another hostname, either keep its current `DEPLOY_DOMAIN` or coordinate the
domain change with a redeploy. Use a trusted certificate for passkeys; temporary
self-signed certificates that the browser does not trust cannot provide a usable
origin for them.

Changing proxy ports in `.env.kamal.<destination>` does not change an existing
proxy container. Recreate it from the deploy environment with
`bin/kamal proxy reboot -d <destination>` (brief outage), then update the Nginx upstream and
reload Nginx. Confirm the new port with `podman ps` as that instance's user.

---

## 7) Day-2 commands

```bash
# deploy a published CI image
bin/kamal deploy -d avd-staging --version v2.13.2 --skip-push

# Rails console and shell in the app container (aliases from deploy.yml)
bin/kamal console -d avd-staging
bin/kamal shell -d avd-staging

# status
bin/kamal app containers -d avd-staging
bin/kamal app details -d avd-staging
bin/kamal app version -d avd-staging
```

Use the current container names from `app containers`. App containers are versioned.
Kamal's `server exec` runs a command over SSH as the deploy user. Use it from
the deploy environment to inspect containers and read their logs:

```bash
bin/kamal server exec -d avd-staging 'podman ps -a --filter label=destination=avd-staging'
bin/kamal server exec -d avd-staging 'podman logs --tail 100 --timestamps CONTAINER_NAME'
bin/kamal server exec -d avd-staging 'podman logs --tail 100 --timestamps --follow CONTAINER_NAME'
```

Put Podman log options before the container name.
`--follow` needs a running container. Use the non-following command to read logs
from a stopped container. Kamal's log subcommands may pass options after the
container name, which this Podman version treats as another container name.

---

## 8) Accessories (DB, Solr)

```bash
bin/kamal accessory details -d avd-staging solr
bin/kamal accessory reboot -d avd-staging solr   # stop, remove, start
bin/kamal accessory restart -d avd-staging db
```

From the deploy environment, read accessory logs with:

```bash
bin/kamal server exec -d avd-staging 'podman logs --tail 100 --timestamps ohd-db'
bin/kamal server exec -d avd-staging 'podman logs --tail 100 --timestamps ohd-solr'
```

Accessory data lives under the remote `DEPLOY_STORAGE_DIR`, not in the repo:

- DB: `<storage>/db`
- Solr: `<storage>/solr`

> **Destructive:** `accessory remove` deletes the accessory's container and image and
> runs `rm -rf ~/<service>-<accessory>`. That includes the data. Dump the database
> first (e.g. `mysqldump`) and make sure you have a copy before you run it.

```bash
bin/kamal accessory remove -d avd-staging solr
bin/kamal accessory boot -d avd-staging solr
```

---

## 9) Reboots and autostart

The bootstrap configures autostart through cron:

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
ssh <deploy-user>@<server> 'bash ~/bin/podman-autostart.sh; tail -20 ~/log/podman-autostart.log'
```

> Do not run `podman system migrate` by hand while containers are running. It stops
> them all. The autostart script only runs it right after a reboot.

After a reboot, check the state:

```bash
ssh <deploy-user>@<server> 'podman ps -a --format "{{.Names}} {{.Status}}"'
```

---

## 10) Job role

The job worker is a separate role in the destination file:

```yaml
servers:
  web:
    - <%= host %>
  job:
    hosts:
      - <%= host %>
    cmd: bundle exec rake jobs:work
```

Locate the job container and check its logs from the deploy environment:

```bash
bin/kamal server exec -d avd-staging 'podman ps -a --filter label=destination=avd-staging --filter label=role=job'
bin/kamal server exec -d avd-staging 'podman logs --tail 100 --timestamps JOB_CONTAINER_NAME'
```

If the first command finds no job container, check whether setup completed and
whether the job role was started.

---

## 11) Deploy an existing image tag

If the image is already in GHCR, deploy it without rebuilding:

```bash
bin/kamal deploy -d avd-staging --version 9f309618fb6335e01c530b27c9c24d5d44181016 --skip-push
```

To redeploy the running version without running bootstrap again, use
`bin/kamal redeploy -d avd-staging`.

---

## 12) Another server (instance)

1. Create `.env.kamal.<destination>` with the values in sections 3 and 4.
2. Enable SSH access for its deploy user.
3. Follow [Setup and deploy](#6-setup-and-deploy) with
   its destination name.

---

## 13) Solr notes

- The app must use `SOLR_URL=http://ohd-solr:8983/solr/blacklight-core`. This is set in
  `config/deploy.yml`.
- The Solr accessory uses the official `docker.io/library/solr:5.5` image. Kamal
  uploads each file in `solr/configsets/sunspot/conf` from the repo, mounts them
  read-only, and runs `solr-precreate` for `blacklight-core`.
- After changing the configset, run `bin/kamal accessory reboot -d avd solr` to
  upload the files and recreate the accessory.
- The Solr data directory must be owned by UID 8983 in the container's user namespace.
  The bootstrap sets this.
- If Solr crash-loops, check its logs:

  ```bash
  bin/kamal server exec -d avd-staging 'podman logs --tail 200 --timestamps ohd-solr'
  ```

---

## 14) Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `current system boot ID differs from cached boot ID` | Podman state from before a reboot | Run `bin/server/bootstrap <destination>`. The autostart script also clears this after a reboot. |
| `unable to start container ... work/work/incompat: permission denied` | Overlay leftovers from an unclean shutdown | The autostart script removes them for stopped containers. Start the container again after the script has run, or run it by hand (section 9). |
| `Operating system error number 13` / `Permission denied` in the MariaDB log | Data directory owned by the wrong UID in the namespace | Run `bin/server/bootstrap <destination>`. Check with `podman unshare stat -c '%u:%g' <storage>/db` (expect `999:999`). |
| Solr cannot write its data | Wrong owner on `<storage>/solr` | As above, expect `8983:8983`. |
| App cannot write to storage, `tmp/` or `log/` | Wrong owner on app volumes | Expect `1000:1000` in Podman's user namespace on `files`, `logs`, `tmp/cache` and `tmp/files`. |
| `rootlessport listen tcp 127.0.0.1:8080: address already in use` | Another proxy uses port 8080, or an existing proxy container still has old port bindings | Set unused proxy ports. Run `bin/kamal proxy reboot -d <destination>` to recreate an existing proxy, then update Nginx. Check listeners with `ss -ltnp`. |
| `kamal-proxy` logs `listen tcp :80: bind: permission denied` | The proxy cannot bind port 80 inside its network namespace | Check that the `proxy.run.options.sysctl` setting is present, then recreate the proxy with `bin/kamal proxy reboot -d <destination>`. |
| Requests return `404` after changing the hostname | Kamal only routes the configured host, or Rails sees HTTP rather than forwarded HTTPS | Check `DEPLOY_DOMAIN`, Nginx's `Host` and `X-Forwarded-Proto` headers, and the matching project domain. |
| `podman logs` reports no container named `--tail` | Kamal passed log options after the container name | Use `bin/kamal server exec` to run `podman logs --tail 100 --timestamps CONTAINER_NAME` remotely. |
| Job log following reports no container ID | No job container is currently running | List all job containers with `bin/kamal server exec`, then read the selected container's logs without `--follow`. |
| `"/" is not a shared mount` | Mount propagation of `/` | The root crontab fixes it at boot. Apply it now: `sudo mount --make-rshared /`. |
| `XDG_RUNTIME_DIR is ... not /run/user/<uid>` (bootstrap warning) | SSH sessions do not export the runtime dir, so Podman uses a different one | Export `XDG_RUNTIME_DIR=/run/user/<uid>` for non-interactive sessions, e.g. in `~/.pam_environment`. Then re-run the bootstrap. |
| Containers are down after a reboot | Autostart did not finish or failed | `~/log/podman-autostart.log` and `~/log/podman-autostart.cron.log` on the server. Then run `bash ~/bin/podman-autostart.sh`. |
| `kamal-podman setup` says Podman is not installed | Bootstrap has not run on this server | Run `bin/server/bootstrap <destination>` first. |
| `docker: command not found` or Docker errors | Plain `kamal` was used | Use `bin/kamal`. |
| `docker exec` / `docker logs` fail | Old commands | Use `podman` on the server, or `bin/kamal ... logs`. |
| Wrong container name in `exec` | App containers are versioned | Use `bin/kamal app containers -d <destination>`. |

---

## 15) Recommended workflow for a new instance

1. Create `.env.kamal.<destination>` using sections 3 and 4, including
   `GITHUB_ACTOR`, `GITHUB_TOKEN`, and unique proxy ports for a shared server.
2. Follow [Setup and deploy](#6-setup-and-deploy) with the new destination name.
3. Configure the Nginx hostname and its upstream port.
4. Reboot the server in a maintenance window and check
   `~/log/podman-autostart.log` and `podman ps -a`.
