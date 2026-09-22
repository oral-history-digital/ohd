# VS Code Dev Containers

Use this guide to start the recommended local development environment in Visual
Studio Code. The complete Dev Container reference is in
[`.devcontainer/README.md`](../../.devcontainer/README.md).

## Before you begin

Install the following tools:

- [Docker](https://www.docker.com/get-started)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Start the development environment

1. Clone the repository and open it in Visual Studio Code.
2. Optional: place a database dump at `.devcontainer/db/dump.sql.gz`.
3. When Visual Studio Code asks, select **OHD Development** and reopen the
   repository in the container.
4. Start the application:

   ```bash
   /workspace/.devcontainer/scripts/start-app.sh
   ```

5. Open [http://portal.oral-history.localhost:3000/](http://portal.oral-history.localhost:3000/).

The development environment creates or imports the development database and
starts supporting services, including MySQL, Solr, and Redis.

## Verify the setup

Sign in with the development account:

- Email: `alice@example.com`
- Password: `password`

If the application does not start or services are unavailable, see the
[Dev Container troubleshooting guide](../../.devcontainer/README.md#troubleshooting).
