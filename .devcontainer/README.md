# Oral History Digital Developer Guide

This guide covers how to set up and run the Oral History Digital application in a development environment using VS Code Dev Containers.

## Getting Started

1. Install [Docker](https://www.docker.com/get-started) on your machine. Ensure you have Docker version 20.10.7 or later.
2. Install [Visual Studio Code](https://code.visualstudio.com/).
3. Install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension for Visual Studio Code.
4. Clone this repository.
5. Open the repository in Visual Studio Code.
6. Download the database dump and place it as `dump.sql.gz` in `.devcontainer/db/`.
7. When prompted, click on "Reopen in Container" to start the development container.

## Setup Process

The Dev Container setup process includes:

- Building the Docker image with Ruby 3.0.7, Node.js 18.x, and other dependencies
- Setting up the MySQL database and Solr search server
- Installing application dependencies via Bundler and Yarn
- Configuring the database and other required services
- Importing the database dump

## Environment Configuration

The setup automatically configures several important files:

- `database.yml` - Configuration for MySQL connection
- `datacite.yml` - Settings for DataCite integration
- `sunspot.yml` - Solr search engine configuration

Database permissions are also automatically configured for proper access from the application.

## Running the Application

Once the container is built and configured, the application should start automatically. If you need to restart it, use:

```sh
/workspace/.devcontainer/scripts/start-app.sh
```

This script will:

- Add the necessary host entry for portal.oral-history.localhost
- Stop any existing application processes
- Start Solr and reindex content
- Start the webpack dev server
- Start the Rails server

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

- URL: [http://portal.oral-history.localhost:3000/za/de](http://portal.oral-history.localhost:3000/za/de)
- Admin login: `alice@example.com`
- Password: `password`

## Container Components

The development environment consists of three services:

- `app`: The main Rails application container
- `db`: MariaDB 10.5 database
- `solr`: Solr 8 search engine

## Development Notes

- The application database is set up with sample data and a development admin user by default
- Source code changes are reflected immediately due to the volume mount
- Node modules are excluded from the bind mount to avoid performance issues
- The container forwards ports 3000 (Rails), 8983 (Solr), and 3035 (webpack-dev-server)

## Rebuilding the Container

If you need to rebuild the container from scratch:

1. Open the VS Code command palette (Ctrl+Shift+P)
2. Select "Dev Containers: Rebuild Container"

This will rebuild the container and run all setup scripts again.