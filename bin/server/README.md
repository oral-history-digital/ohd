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

Hosts, ssh user and directories come from `config/deploy.yml` and
`config/deploy.<destination>.yml`. Nothing is hard-coded here.

## Adding a server

1. Copy `config/deploy.avd-staging.yml` to `config/deploy.<name>.yml` and change the
   values at the top: `ssh_user`, `host_ip`, `domain`, `arch`.
2. Put the secrets for it in `.kamal/secrets.<name>`.
3. Make sure the ssh user can log in and has passwordless sudo.
4. Bootstrap, then set up Kamal:

   ```sh
   bin/server/bootstrap <name>
   bundle exec kamal-podman setup -d <name>
   ```

   `kamal-podman setup` checks that podman is installed on each host before it runs
   the `docker-setup` hook. On a new server, run `bin/server/bootstrap` first (step 4).
   The hook then re-applies the bootstrap during setup, which is harmless.

Use `bin/server/layout.rb <name>` to print the host layout without touching a server.
