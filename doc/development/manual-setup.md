# Manual setup

Manual setup is for maintaining an existing non-container development
installation. For a new environment, use [VS Code Dev Containers](devcontainer.md)
or the [Docker instance setup](../operations/docker_instance_setup.md).

## Requirements

Install and configure the following dependencies yourself:

- Ruby 3.3.4
- MySQL or MariaDB
- Node.js 18 through 24 and Yarn 1.22.22
- Java, for Solr
- ClamAV
- LuaTeX with FreeFont and Noto fonts, if you generate PDFs

OHD reads database and Solr connection settings from
`config/database.yml` and `config/sunspot.yml`. Provide services that match
those settings before you prepare the application.

## Prepare the application

From the repository root, run:

```bash
bin/setup
```

The setup script installs Ruby and JavaScript dependencies, prepares the
database, clears temporary files, and restarts the application server.

## Start supporting services

Start Solr separately, then start the Rails application using the local process
manager or your established service configuration. See the repository scripts
in `bin/` and the relevant configuration files for the commands used by your
installation.

## Verify the setup

Open the local application URL configured for your instance. Confirm that Rails
can connect to the database and Solr, then run a known search. See
[Reindexing](../operations/reindexing.md) if the search index needs rebuilding.
