# Kamal deployment guide (OHD)

OHD is deployed with **kamal-podman**, the Podman fork of Kamal (gem `kamal_podman`
on top of Kamal 2.12). Always run it through Bundler:

```bash
bundle exec kamal-podman <command> -d <destination>
```

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
| `config/deploy.yml` | Shared base config: image, env, aliases, accessory images, env and directories. Contains no hosts, paths or domains. |
| `config/deploy.avd-staging.yml` | Destination config. Top block sets `ssh_user`, `host_ip`, `domain`, `arch`. Also sets roles, proxy, volumes and accessory hosts. |
| `.kamal/secrets-common` | Optional. Secrets shared by all destinations. |
| `.kamal/secrets.avd-staging` | Secrets for this destination. Keep out of git. |
| `.kamal/hooks/docker-setup` | Runs during `kamal-podman setup` and calls `bin/server/bootstrap`. |
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
- A deploy user (e.g. `avd1`) with passwordless `sudo`
- Nothing else. `bin/server/bootstrap` installs Podman and everything it needs.
  Docker is not used.

---

## 3) Environment variables (local)

Read from your shell (or `.env`) when Kamal renders the ERB config and logs in to the
registry:

- `GITHUB_ACTOR`: GitHub user for GHCR
- `GITHUB_TOKEN`: token with `read:packages` (`write:packages` if you push images)

No other variables are needed. Server-specific values are in the destination file.

---

## 4) Secrets

Kamal reads `.kamal/secrets-common` and `.kamal/secrets.<destination>`. It does **not**
read a plain `.kamal/secrets` file.

`.kamal/secrets.avd-staging` must define every secret referenced in the config:

- `RAILS_MASTER_KEY`
- `MYSQL_PASSWORD_PRODUCTION`
- `OIDC_SIGNING_KEY`
- `SECRET_KEY_BASE`
- `MARIADB_ROOT_PASSWORD`
- `MARIADB_PASSWORD`
- `CERTIFICATE_PEM` and `PRIVATE_KEY_PEM` (inline TLS for the proxy)

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

```bash
bin/server/bootstrap avd-staging               # once per server
bundle exec kamal-podman setup -d avd-staging  # accessories, proxy, app
bundle exec kamal-podman deploy -d avd-staging
```

`kamal-podman setup` first checks that Podman is installed on each host, then runs the
`docker-setup` hook. The hook runs the bootstrap again. That is harmless, and it makes
sure a server that was set up by hand also gets the current autostart script.

---

## 7) Day-2 commands

```bash
# deploy the current commit
bundle exec kamal-podman deploy -d avd-staging

# Rails console and shell in the app container (aliases from deploy.yml)
bundle exec kamal-podman console -d avd-staging
bundle exec kamal-podman shell -d avd-staging

# web and job logs
bundle exec kamal-podman logs -d avd-staging          # alias for app logs -f
bundle exec kamal-podman joblogs -d avd-staging       # alias for app logs -r job -f

# status
bundle exec kamal-podman app containers -d avd-staging
bundle exec kamal-podman app details -d avd-staging
bundle exec kamal-podman app version -d avd-staging
```

Use the current container names from `app containers`. App containers are versioned.

---

## 8) Accessories (DB, Solr)

```bash
bundle exec kamal-podman accessory details -d avd-staging solr
bundle exec kamal-podman accessory logs -d avd-staging db
bundle exec kamal-podman accessory reboot -d avd-staging solr   # stop, remove, start
bundle exec kamal-podman accessory restart -d avd-staging db
```

Accessory data lives in the remote home, not in the repo:

- DB: `~/ohd-db/data`
- Solr: `~/ohd-solr/solr_data`

> **Destructive:** `accessory remove` deletes the accessory's container and image and
> runs `rm -rf ~/<service>-<accessory>`. That includes the data. Dump the database
> first (e.g. `mysqldump`) and make sure you have a copy before you run it.

```bash
bundle exec kamal-podman accessory remove -d avd-staging solr
bundle exec kamal-podman accessory boot -d avd-staging solr
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
bundle exec kamal-podman app logs -d avd-staging -r job -f
```

---

## 11) Deploy an existing image tag

If the image is already in GHCR, deploy it without rebuilding:

```bash
bundle exec kamal-podman deploy -d avd-staging --version 9f309618fb6335e01c530b27c9c24d5d44181016 --skip-push
bundle exec kamal-podman deploy -d avd-staging --version latest -P
```

To redeploy the running version without running the bootstrap again, use
`kamal-podman redeploy`.

---

## 12) Another server (instance)

1. Copy the destination file:

   ```bash
   cp config/deploy.avd-staging.yml config/deploy.<name>.yml
   ```

2. Change the top block of `config/deploy.<name>.yml`:

   ```erb
   <%
     ssh_user = "avd1"                    # deploy user on the server
     home     = "/home/#{ssh_user}"       # its home directory
     storage  = "#{home}/avd/storage"     # app volumes live here
     host_ip  = "160.45.152.195"
     domain   = "staging.audio-visual.digital"
     arch     = "amd64"                   # builder arch of the server
   %>
   ```

   The rest of the file uses these values. Check the other values in the file too:
   `env.clear.OHD_EXTRA_HOSTS_PRODUCTION`, the `proxy` block, and the `job` command.

3. Create `.kamal/secrets.<name>` with all secrets from section 4.
4. Make sure the deploy user can log in over SSH and has passwordless `sudo`.
5. Run:

   ```bash
   bin/server/bootstrap <name>
   bundle exec kamal-podman setup -d <name>
   bundle exec kamal-podman deploy -d <name>
   ```

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
  bundle exec kamal-podman accessory logs -d avd-staging solr
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
| `rootlessport listen tcp 0.0.0.0:80: address already in use` | Something else listens on port 80 | `ss -ltnp` on the server. Stop the other service, or check that the sysctl is set (bootstrap). |
| `"/" is not a shared mount` | Mount propagation of `/` | The root crontab fixes it at boot. Apply it now: `sudo mount --make-rshared /`. |
| `XDG_RUNTIME_DIR is ... not /run/user/<uid>` (bootstrap warning) | SSH sessions do not export the runtime dir, so Podman uses a different one | Export `XDG_RUNTIME_DIR=/run/user/<uid>` for non-interactive sessions, e.g. in `~/.pam_environment`. Then re-run the bootstrap. |
| Containers are down after a reboot | Autostart did not finish or failed | `~/log/podman-autostart.log` and `~/log/podman-autostart.cron.log` on the server. Then run `bash ~/bin/podman-autostart.sh`. |
| `kamal-podman setup` says Podman is not installed | Bootstrap has not run on this server | Run `bin/server/bootstrap <dest>` first. |
| `docker: command not found` or Docker errors | Plain `kamal` was used | Use `bundle exec kamal-podman`. |
| `docker exec` / `docker logs` fail | Old commands | Use `podman` on the server, or `bundle exec kamal-podman ... logs`. |
| Wrong container name in `exec` | App containers are versioned | Use `bundle exec kamal-podman app containers -d <dest>`. |

---

## 15) Recommended workflow for a new instance

1. Copy `deploy.avd-staging.yml` to `deploy.<name>.yml` and change the top block (section 12).
2. Create `.kamal/secrets.<name>`.
3. Export `GITHUB_ACTOR` and `GITHUB_TOKEN`.
4. Run:

   ```bash
   bin/server/bootstrap <name>
   bundle exec kamal-podman setup -d <name>
   bundle exec kamal-podman deploy -d <name>
   ```

5. Reboot the server in a maintenance window and check
   `~/log/podman-autostart.log` and `podman ps -a`.
