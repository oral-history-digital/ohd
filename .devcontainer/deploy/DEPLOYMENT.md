# Deployment Setup

This project provides two separate devcontainer environments:

1. **Development Environment** (`.devcontainer/dev/`) - Full development setup with Solr, database, etc.
2. **Deployment Environment** (`.devcontainer/deploy/`) - Minimal environment for deployment only

## Quick Setup

1. **Copy the example environment file:**

    ```bash
    cp .devcontainer/deploy/.env.example .devcontainer/.env
    ```

2. **Edit `.devcontainer/.env`** with your actual deployment configuration:
    - **Required:** Set FQDN hostnames and SSH key path
    - **Optional:** Set IP addresses (only if you need to override DNS resolution)
    - **Optional:** Set VPN DNS servers (only if your VPN requires specific DNS)

3. **Ensure your SSH key exists** and has the correct permissions on your host:

    ```bash
    chmod 600 /path/to/your/ssh/key
    ```

4. **Add your SSH public key to the deployment servers** (see SSH Key Setup section below)

## Configuration Options

### Required Settings

- `STAGING_ALIAS` / `PROD_ALIAS` - SSH host aliases
- `STAGING_FQDN` / `PROD_FQDN` - Fully qualified domain names
- `SSH_KEY_PATH` - Path to your SSH private key

### Optional Settings

- `STAGING_IP` / `PROD_IP` - Only needed if you want to add /etc/hosts mappings to override DNS
- `STAGING_USER` / `PROD_USER` - Defaults to "deploy" if not specified
- `STAGING_PORT` / `PROD_PORT` - Defaults to 22 if not specified
- `VPN_DNS1` / `VPN_DNS2` - Only needed if your VPN requires specific DNS servers

## How to Switch Environments

### First Time Setup

1. **Close VS Code completely**
2. **Reopen your workspace folder**
3. **VS Code will automatically detect multiple devcontainer configurations**
4. **Choose:** "OHD Development" or "OHD Deploy" from the dropdown

### Switching Between Environments

1. **Open your workspace folder** in VS Code (without the active Devcontainer)
2. Do one of the following:

- **Choose:** "Reopen in Container" in the popup that should appear on the lower right
- Hit **Shift+Ctrl+P** and write/select "Dev Containers: Reopen in Container"

3. **Choose:** "OHD Development" or "OHD Deploy" from the dropdown

## Two Environment Approach

### Development Environment (Default)

- **Use for:** Daily development work
- **Contains:** Solr, database, full development stack
- **Network:** Bridge mode (Docker services work normally, VPN connection won't)

### Deployment Environment

- **Use for:** Deployment tasks only
- **Contains:** Minimal Ruby environment, deployment tools
- **Network:** Host mode (full VPN access)
- **Cannot run:** Solr, database (not included)

## How to Deploy

1. **Connect to VPN** on your host machine (if required)

2. **Switch to deployment environment:**
    - Press `Ctrl+Shift+P`
    - Select "Dev Containers: Reopen in Container"
    - Choose "OHD Deploy" from the list

3. **Deploy:**

    ```bash
    # Deploy to staging
    bundle exec cap ohd_archive_staging deploy

    # Deploy to production
    bundle exec cap ohd_archive deploy
    ```

4. **Switch back to development** when done:
    - Press `Ctrl+Shift+P`
    - Select "Dev Containers: Reopen in Container"
    - Choose "OHD Development" from the list

## Testing SSH Connections

Test your SSH configuration before deploying:

```bash
# Test staging connection
ssh -vvv <staging-alias>

# Test production connection
ssh -vvv <prod-alias>
```

## SSH Key Setup

For deployment to work, your SSH public key must be authorized on the deployment servers:

### Option 1: Using ssh-copy-id (recommended)

```bash
# Copy your public key to staging server
ssh-copy-id -i /path/to/your/ssh/key.pub deploy@staging-server-fqdn

# Copy your public key to production server
ssh-copy-id -i /path/to/your/ssh/key.pub deploy@production-server-fqdn
```

### Option 2: Manual setup

1. Get your public key content:

    ```bash
    cat /path/to/your/ssh/key.pub
    ```

2. On each deployment server, add the public key to the authorized_keys file:
    ```bash
    # On the deployment server
    echo "your-public-key-content-here" >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    ```

### Option 3: Ask your system administrator

- Provide your public key content to the system administrator
- Request access to the deployment user account on both staging and production servers

## Troubleshooting

### "Name or service not known" errors

- Check that your VPN is connected
- Verify FQDNs in `.env` are correct
- If using IP addresses, ensure they're correct
- Ensure DNS servers in `.env` can resolve your deployment hosts (if configured)

### SSH authentication errors

- Verify your SSH key path in `.env` is correct
- Check that your SSH key has proper permissions (600)
- **Ensure your SSH public key is added to the deployment servers:**
    - Your public key must be in `~/.ssh/authorized_keys` on the target servers
    - Test with: `ssh-copy-id -i /path/to/your/ssh/key.pub user@server`
    - Or manually copy the content of your `.pub` file to the server's authorized_keys
- Ensure the SSH key is authorized on the deployment servers

### "No such file or directory" for local override files

- Make sure you've copied the .env.example file: `cp .devcontainer/.env.example .devcontainer/.env`
- The container will work without `.env`, but you need it for actual deployments

## Security Notes

- The `.env` file is git-ignored to prevent committing secrets
- SSH keys are mounted read-only into the container
- Each developer maintains their own deployment configuration
