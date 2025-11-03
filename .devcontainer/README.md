# Oral History Digital Developer Guide

This guide covers how to set up and run the Oral History Digital application using VS Code Dev Containers.

## Two Container Environments

This project provides two separate devcontainer environments:

1. **Development Environment** (`.devcontainer/dev/`) - Full development setup with Solr, database, etc.
2. **Deployment Environment** (`.devcontainer/deploy/`) - Minimal environment for deployment tasks only

## Getting Started (Development)

1. Install [Docker](https://www.docker.com/get-started) on your machine. Ensure you have Docker version 20.10.7 or later.
2. Install [Visual Studio Code](https://code.visualstudio.com/).
3. Install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension for Visual Studio Code.
4. Clone this repository.
5. Open the repository in Visual Studio Code.
6. Download the database dump and place it as `dump.sql.gz` in `.devcontainer/db/`.
7. When prompted, choose "OHD Development" from the dropdown to start the development container.

## Switching Between Environments

### First Time Setup

1. **Close VS Code completely**
2. **Reopen your workspace folder**
3. **VS Code will automatically detect multiple devcontainer configurations**
4. **Choose:** "OHD Development" or "OHD Deploy" from the dropdown

### Switching Between Environments

1. In your workspace outside the devcontainer, **press `Ctrl+Shift+P`**
2. **Type:** `Dev Containers: Reopen in Container`
3. **Choose:** "OHD Development" or "OHD Deploy" from the dropdown

## Development Environment

Use the **Development Environment** for development work.

### What's Included

-   Full Rails application stack
-   MySQL database with sample data
-   Solr search engine
-   Webpack dev server
-   All development dependencies

### Network Mode

-   Bridge mode (Docker services work normally)
-   No VPN access from container

## Deployment Environment

See [deploy/DEPLOYMENT.md](deploy/DEPLOYMENT.md) for detailed setup instructions.

### What's Included

-   Minimal Ruby environment
-   Deployment tools (Capistrano)
-   SSH configuration

### What's NOT Included

-   Database (cannot run migrations or seed data)
-   Solr (cannot reindex or search)
-   Webpack dev server

### Network Mode

-   Host mode (full VPN access for deployment)

## Setup Process (Development Environment)

The Dev Container setup uses a pre-built base image for faster startup times. The setup process includes:

-   Pulling the pre-built base image with Ruby 3.3.4, Node.js 18.x, Java, and system dependencies
-   Building the development image with application-specific dependencies
-   Setting up the MySQL database and Solr search server
-   Installing application dependencies via Bundler and Yarn
-   Configuring the database and other required services
-   Importing the database dump

## Docker Architecture

The development environment uses a two-stage Docker setup:

1. **Base Image (`Dockerfile.ruby-base`)**: Creates a foundation image with Ruby 3.3.4, Node.js 18.x, Java, and pre-installed system dependencies. This image is built and published to GitHub Container Registry as `ghcr.io/yotkadata/rails-base:latest`.

2. **Development Image (`.devcontainer/Dockerfile`)**: Uses the pre-built base image and adds application-specific dependencies and configuration for the development environment.

## Environment Configuration

The setup automatically configures several important files:

-   `database.yml` - Configuration for MySQL connection
-   `datacite.yml` - Settings for DataCite integration
-   `sunspot.yml` - Solr search engine configuration

Database permissions are also automatically configured for proper access from the application.

## Running the Application

Once the container is built and configured, the application should start automatically. If you need to restart it, use:

```sh
/workspace/.devcontainer/scripts/start-app.sh
```

This script will:

-   Add the necessary host entry for portal.oral-history.localhost
-   Stop any existing application processes
-   Start Solr and reindex content
-   Start the webpack dev server
-   Start the Rails server

## Troubleshooting

If you encounter database connection issues:

1. Verify MySQL is running properly:

    ```sh
    mysql -h db -u root -prootpassword -e "SHOW DATABASES;"
    ```

2. Check database user permissions:

    ```sh
    mysql -h db -u root -prootpassword -e "SELECT User, Host FROM mysql.user;"
    ```

3. Ensure proper grants are in place:

    ```sh
    mysql -h db -u root -prootpassword -e "GRANT ALL PRIVILEGES ON ohd_development.* TO 'root'@'%'; FLUSH PRIVILEGES;"
    ```

4. If all else fails, rebuild the container:
    - Open the VS Code command palette (Ctrl+Shift+P)
    - Select "Dev Containers: Rebuild Container"

## Accessing the Application

After starting the application, you can access it at:

-   URL: [http://portal.oral-history.localhost:3000/](http://portal.oral-history.localhost:3000/)
-   Admin login: `alice@example.com`
-   Password: `password`

## Container Components (Development Environment)

The development environment consists of three services:

-   `app`: The main Rails application container
-   `db`: MariaDB 10.5 database
-   `solr`: Solr 8 search engine

## Development vs Deployment

| Feature          | Development Environment | Deployment Environment |
| ---------------- | ----------------------- | ---------------------- |
| **Purpose**      | Development             | Deployment tasks only  |
| **Database**     | ✅ Full MySQL setup     | ❌ Not available       |
| **Solr**         | ✅ Search indexing      | ❌ Not available       |
| **VPN Access**   | ❌ Not available        | ✅ Full access         |
| **Network Mode** | Bridge                  | Host                   |
| **Size**         | Large (full stack)      | Minimal                |

## Deployment

For deployment instructions, see [deploy/DEPLOYMENT.md](deploy/DEPLOYMENT.md).

## Development Notes

-   The application database is set up with sample data and a development admin user by default
-   Source code changes are reflected immediately due to the volume mount
-   Node modules are excluded from the bind mount to avoid performance issues
-   The container forwards ports 3000 (Rails), 8983 (Solr), and 3035 (webpack-dev-server)

## Rebuilding the Container

If you need to rebuild the container from scratch:

1. Open the VS Code command palette (Ctrl+Shift+P)
2. Select "Dev Containers: Rebuild Container"

This will rebuild the container and run all setup scripts again.
