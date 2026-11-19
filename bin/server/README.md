# Server bootstrap

`bin/server/bootstrap <destination>` prepares the server(s) of a Kamal destination for
rootless Podman. It runs over ssh and is safe to re-run.

What it does on each host:

- installs `podman uidmap slirp4netns cron` (and `passt` if available)
- adds the subuid/subgid range for the deploy user if it is missing
- allows rootless ports from 80 (sysctl)
- creates `/run/user/<uid>` and makes `/` shared at every boot (root's crontab)
- creates the host directories from `volumes` and accessory `directories`, and gives
  them the owner the container expects (mariadb 999, solr 8983, appuser 1000)
- clears podman state left over from a reboot
- installs `~/bin/podman-autostart.sh` and starts it at boot (user's crontab)

Hosts, SSH user, and directories come from `.env.kamal.<destination>`.
See `.env.example` for the required `DEPLOY_*` variables.

## Adding a server

1. Set `DEPLOY_HOST`, `DEPLOY_SSH_USER`, `DEPLOY_DOMAIN`, and
   `DEPLOY_STORAGE_DIR` in `.env.kamal.<name>`. The bootstrap and Kamal wrapper
   load this file automatically.
2. Include the secrets referenced by
   `.kamal/secrets-common`.
3. Enable SSH access for the deploy user and grant temporary passwordless sudo.
4. Bootstrap the server from your workstation.

   ```sh
   bin/server/bootstrap <name>
   ```

5. Revoke the deploy user's temporary sudo access, then run the first deployment.

   ```sh
   bin/kamal setup -d <name>
   ```

Use `bin/kamal deploy -d <name>` for subsequent releases. The wrapper creates
the ignored empty destination file required by Kamal.

To inspect the layout directly with `bin/server/layout.rb <name>`, load the
instance's environment first; the Ruby script does not load it itself.
