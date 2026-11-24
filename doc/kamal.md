# Kamal deployment guide (OHD)

OHD is deployed with **kamal-podman**, the Podman fork of Kamal (gem `kamal_podman`
on top of Kamal 2.12). Set these variables in the deploy shell before running the commands below:

```bash
DESTINATION=your-instance
IMAGE_TAG=your-published-image-tag
```

Replace the values with your destination name (the suffix of `.env.kamal.<destination>`)
and a published image tag. Keep using the same shell for the examples. Run Kamal
through the repository wrapper: `bin/kamal <command> -d "$DESTINATION"`.

The wrapper loads `.env.kamal.<destination>` and creates Kamal's required,
ignored `config/deploy.<destination>.yml` with no instance settings.

Do not use plain `kamal`. It targets Docker, and the servers only run Podman.

This guide covers:

- files and structure
- prerequisites and secrets
- setting up a new server (bootstrap)
- deploys, console and logs
- accessories (DB, Solr, ClamAV)
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
| `bin/server/bootstrap` | Sets up the server(s) of a destination over SSH. Safe to re-run. Requires passwordless `sudo` on the server.|
| `bin/server/remote-bootstrap.sh` | The part that runs on the server. Called by `bin/server/bootstrap`. |
| `bin/server/podman-autostart.sh` | Installed on the server as `~/bin/podman-autostart.sh`. Starts the containers after a reboot. |
| `bin/server/layout.rb` | Renders the config and prints the hosts and host directories. Use it to check what the bootstrap will do. |
| `bin/server/README.md` | Short version of this section for new servers. |
| `Dockerfile` | App image. Runtime user `appuser` has UID/GID 1000. |
| `Dockerfile.base` | Shared base image (system packages, Node, Yarn). |

---

## 2) Prerequisites

**Local machine**

- Ruby and Bundler, with the repo's gems installed (`bundle install`) or Devcontainer (Profile: deploy)
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

## 3) Configure an instance

Create `.env.kamal.<destination>` in the repository root, using
[`.env.example`](../.env.example) for variable names. Set the `DEPLOY_*`
inputs, the required app secrets, and the unsuffixed `MYSQL_*` and `DATACITE_*`
names; the environment-specific names in the example support legacy deploys.
The destination passed with `-d` selects this file; it does not have to match
the SSH user.

Keep the file private (`chmod 600`) and out of Git. Both `bin/kamal` and
`bin/server/bootstrap` load it automatically. Kamal then maps secrets through
[`.kamal/secrets-common`](../.kamal/secrets-common). Set `MYSQL_PASSWORD` once;
the mapping supplies the same value as `MARIADB_PASSWORD`, the name required by
the MariaDB image.

Check these deployment-specific values before running setup:

- `DEPLOY_HOST` is an address reachable from the deploy environment.
- `DEPLOY_STORAGE_DIR` is an absolute path on the server.
- `DEPLOY_SSH_KEY`, if set, names a readable private key in the deploy
  environment. For the deploy devcontainer, set `DEPLOY_KEYS_DIR` in
  `.devcontainer/deploy/.env` to the host key directory, recreate the container,
  and set `DEPLOY_SSH_KEY` to the key's path *inside* it. Check with
  `test -r "$DEPLOY_SSH_KEY"` in the deploy shell.
- Give each destination on the same server distinct
  `DEPLOY_PROXY_HTTP_PORT` and `DEPLOY_PROXY_HTTPS_PORT` values. Their defaults
  are `8080` and `8443`; Nginx forwards to the HTTP port.
- `DEPLOY_RAILS_ENV` defaults to `production`; set it to `staging` for a Rails
  staging instance. `DEPLOY_ARCH` defaults to `amd64`.
- Set `OHD_EXTRA_HOSTS` only when Rails must accept additional hostnames.
- Set `GITHUB_ACTOR` and `GITHUB_TOKEN` for GHCR access. The token needs
  `read:packages`, or `write:packages` if you push images.

Kamal mounts `files`, `logs`, `tmp/cache`, `tmp/files`, and `clamav-db` under
`DEPLOY_STORAGE_DIR` into both app roles. The ClamAV signature mount is
read-only in the app containers; the rest of `/app/tmp` stays ephemeral.

---

## 4) Set up a server (bootstrap)

```bash
bin/server/bootstrap "$DESTINATION"
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
ruby bin/server/layout.rb "$DESTINATION"
```

> `bin/server/bootstrap` replaces Kamal's own `kamal-podman server bootstrap`, which
> only checks that Podman is installed.

---

## 5) Setup and deploy

Follow [the server bootstrap guide](../bin/server/README.md) to enable the
deploy user's SSH key and temporary passwordless sudo. Run bootstrap from the
deploy environment:

```bash
bin/server/bootstrap "$DESTINATION"
```

After bootstrap succeeds, revoke the deploy user's temporary sudo access. Run the
first deployment with a published image tag to start the accessories, proxy,
and app:

```bash
bin/kamal setup -d "$DESTINATION" --version "$IMAGE_TAG" --skip-push
```

On a fresh, empty MariaDB database, the first setup starts the accessories but
the web container cannot boot until the schema exists. After that first setup
attempt, load the schema once and retry setup with the same image tag:

```bash
bin/kamal app exec --primary -d "$DESTINATION" --version "$IMAGE_TAG" "bin/rails db:schema:load"
bin/kamal setup -d "$DESTINATION" --version "$IMAGE_TAG" --skip-push
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

## 6) Day-2 commands

```bash
# Deploy a published CI image
bin/kamal deploy -d "$DESTINATION" --version "$IMAGE_TAG" --skip-push

# Rails console and shell in the app container (aliases from deploy.yml)
bin/kamal console -d "$DESTINATION"
bin/kamal shell -d "$DESTINATION"

# Status
bin/kamal app containers -d "$DESTINATION"
bin/kamal app details -d "$DESTINATION"
bin/kamal app version -d "$DESTINATION"
```

Use the current container names from `app containers`. App containers are versioned.
Kamal's `server exec` runs a command over SSH as the deploy user. Use it from
the deploy environment to inspect containers and read their logs:

```bash
bin/kamal server exec -d "$DESTINATION" 'podman logs --tail 100 --timestamps CONTAINER_NAME'
bin/kamal server exec -d "$DESTINATION" 'podman logs --tail 100 --timestamps --follow CONTAINER_NAME'
```

Put Podman log options before the container name.
`--follow` needs a running container. Use the non-following command to read logs
from a stopped container. Kamal's log subcommands may pass options after the
container name, which this Podman version treats as another container name.

---

## 7) Accessories (DB, Solr, ClamAV)

```bash
bin/kamal accessory details -d "$DESTINATION" solr
bin/kamal accessory reboot -d "$DESTINATION" solr   # stop, remove, start
bin/kamal accessory restart -d "$DESTINATION" db
```

From the deploy environment, read accessory logs with:

```bash
bin/kamal server exec -d "$DESTINATION" 'podman logs --tail 100 --timestamps ohd-db'
bin/kamal server exec -d "$DESTINATION" 'podman logs --tail 100 --timestamps ohd-solr'
bin/kamal server exec -d "$DESTINATION" 'podman logs --tail 100 --timestamps ohd-clamav'
```

Accessory data lives under the remote `DEPLOY_STORAGE_DIR`, not in the repo:

- DB: `<storage>/db`
- Solr: `<storage>/solr`
- ClamAV signatures: `<storage>/clamav-db`

For an existing deployment, start the new ClamAV accessory, then redeploy the
published app image so both app roles receive the read-only signature mount:

```bash
bin/server/bootstrap "$DESTINATION"
bin/kamal accessory boot -d "$DESTINATION" clamav
bin/kamal deploy -d "$DESTINATION" --version "$IMAGE_TAG" --skip-push
```

FreshClam may need time to download signatures on first start. Check the
accessory log above, then confirm the database is visible to a running app
container (replace `WEB_CONTAINER_NAME` with the name from `app containers`):

```bash
bin/kamal app containers -d "$DESTINATION"
bin/kamal server exec -d "$DESTINATION" 'podman exec WEB_CONTAINER_NAME clamscan --version'
```

The app scans uploads with its own `clamscan` binary and the shared signatures;
it does not connect to a ClamAV daemon. The accessory runs FreshClam only.

> **Destructive:** `accessory remove` deletes the accessory's container and image and
> runs `rm -rf ~/<service>-<accessory>`. That includes the data. Dump the database
> first (e.g. `mysqldump`) and make sure you have a copy before you run it.

```bash
bin/kamal accessory remove -d "$DESTINATION" solr
bin/kamal accessory boot -d "$DESTINATION" solr
```

---

## 8) Reboots and autostart

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
4. Starts the accessories (DB, Solr, ClamAV), waits 15 s.
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

## 9) Job role

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
bin/kamal server exec -d "$DESTINATION" "podman ps -a --filter label=destination=$DESTINATION --filter label=role=job"
bin/kamal server exec -d "$DESTINATION" 'podman logs --tail 100 --timestamps JOB_CONTAINER_NAME'
```

If the first command finds no job container, check whether setup completed and
whether the job role was started.

---

## 10) Deploy an existing image tag

If the image is already in GHCR, deploy it without rebuilding:

```bash
bin/kamal deploy -d "$DESTINATION" --version "$IMAGE_TAG" --skip-push
```

To redeploy the running version without running bootstrap again, use
`bin/kamal redeploy -d "$DESTINATION"`.

---

## 11) Solr notes

- The app must use `SOLR_URL=http://ohd-solr:8983/solr/blacklight-core`. This is set in
  `config/deploy.yml`.
- The Solr accessory uses the official `docker.io/library/solr:5.5` image. Kamal
  uploads each file in `solr/configsets/sunspot/conf` from the repo, mounts them
  read-only, and runs `solr-precreate` for `blacklight-core`.
- After changing the configset, run `bin/kamal accessory reboot -d "$DESTINATION" solr` to
  upload the files and recreate the accessory.
- The Solr data directory must be owned by UID 8983 in the container's user namespace.
  The bootstrap sets this.
- If Solr crash-loops, check its logs:

  ```bash
  bin/kamal server exec -d "$DESTINATION" 'podman logs --tail 200 --timestamps ohd-solr'
  ```

---

## 12) Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `current system boot ID differs from cached boot ID` | Podman state from before a reboot | Run `bin/server/bootstrap <destination>`. The autostart script also clears this after a reboot. |
| `unable to start container ... work/work/incompat: permission denied` | Overlay leftovers from an unclean shutdown | The autostart script removes them for stopped containers. Start the container again after the script has run, or run it by hand (section 8). |
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
