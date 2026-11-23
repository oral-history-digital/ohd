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
`<destination>` selects an instance's environment file; `<deploy-user>` is
its `DEPLOY_SSH_USER` account on the server. They may have different names.

## Adding a server

1. Set `DEPLOY_HOST`, `DEPLOY_SSH_USER`, `DEPLOY_DOMAIN`, and
   `DEPLOY_STORAGE_DIR` in `.env.kamal.<destination>`. The bootstrap and Kamal wrapper
   load this file automatically.
2. Set the secrets listed in `.kamal/secrets-common` in the same
   `.env.kamal.<destination>` file. The Kamal wrapper loads this file automatically;
   `.kamal/secrets-common` reads the values but does not define them.
3. Enable SSH access for the deploy user and grant temporary passwordless sudo.
   To set up `<deploy-user>`, log in to the server as an administrator with
   sudo access and add your deployment public key:

    ```sh
    sudo -iu <deploy-user>
    install -d -m 700 ~/.ssh
    nano ~/.ssh/authorized_keys  # Paste the deployment public key on one line.
    chmod 600 ~/.ssh/authorized_keys
    exit
    ```

    Create a temporary sudoers file with
    `sudo visudo -f /etc/sudoers.d/<deploy-user>-bootstrap` and add this line:

    ```text
    <deploy-user> ALL=(ALL) NOPASSWD: ALL
    ```

    From the same environment where you run bootstrap (for example, the deploy
    devcontainer), load the instance settings and verify SSH and passwordless
    sudo. Replace `ohd` with your destination:

    ```bash
    destination=ohd
    source ".env.kamal.$destination"
    ssh_args=()
    if [[ -n "${DEPLOY_SSH_KEY:-}" ]]; then
      ssh_args=(-o IdentitiesOnly=yes -i "$DEPLOY_SSH_KEY")
    fi
    ssh "${ssh_args[@]}" "$DEPLOY_SSH_USER@$DEPLOY_HOST" 'sudo -n true'
    ```

4. Bootstrap the server from your workstation.

    ```sh
    bin/server/bootstrap <destination>
    ```

5. Revoke the deploy user's temporary sudo access on the server:

    ```sh
    sudo rm /etc/sudoers.d/<deploy-user>-bootstrap
    ```

    Run the first deployment from your workstation:

    ```sh
    bin/kamal setup -d <destination> --version <published-image-tag> --skip-push
    ```

Use `bin/kamal deploy -d <destination> --version <published-image-tag> --skip-push`
for subsequent releases. The wrapper creates the ignored empty destination
file required by Kamal.

To inspect the layout directly with `bin/server/layout.rb <destination>`, load the
instance's environment first; the Ruby script does not load it itself.
