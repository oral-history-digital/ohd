# Oral History.Digital

A curation and research platform for scholarly collections of audio-visual narrative interviews.

https://www.oral-history.digital/

We have only recently released this software as Open Source.
At the moment, you can set up the OHD software in your development environment.
Without any modifications, it is probably not yet suitable for running in
production without any modifications.

## Development Options

There are two ways to set up this project for development:

1. [Setup with VS Code Dev Containers](#vs-code-dev-containers-setup) (recommended)
2. [Manual Setup](#manual-setup)

## VS Code Dev Containers Setup

This project includes a fully configured Dev Container setup for easy development with Visual Studio Code.

### Prerequisites

* [Docker](https://www.docker.com/get-started) (version 20.10.7 or later)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension for VS Code

### Setup Process

1. Clone this repository
2. Open the repository in Visual Studio Code
3. Download the database dump and place it as `dump.sql.gz` in `.devcontainer/db/`
4. When prompted, click on "Reopen in Container" to start the development container

The Dev Container setup will automatically:
- Build the Docker image with Ruby 3.0.7, Node.js 18.x, and other dependencies
- Set up the MySQL database and Solr search server
- Install application dependencies
- Configure the database and other required services
- Import the database dump

### Running the Application

Once the container is built and configured, the application should start automatically. If you need to restart it, use:

```sh
/workspace/.devcontainer/scripts/start-app.sh
```

### Accessing the Application

After starting the application, you can access it at:

- URL: [http://portal.oral-history.localhost:3000/za/de](http://portal.oral-history.localhost:3000/za/de)
- Admin login: `alice@example.com`
- Password: `password`

### Container Components

The development environment consists of three services:
- `app`: The main Rails application container
- `db`: MariaDB 10.5 database
- `solr`: Solr 8 search engine

For more detailed information about the Dev Container setup, see [.devcontainer/README.md](.devcontainer/README.md).

## Manual Setup

### Prerequisites

* Ruby 3.0.7
* MySQL/MariaDB
* Node.js >=18
* yarn
* Java Runtime Environment (Version 8)
* optional: LuaTeX for PDF generation including FreeFont and Noto fonts.

### Application Setup

This is how to setup the OHD archive software in your development environment
on Linux.

1. Install system packages:
   ```bash
   sudo apt install temurin-8-jdk-amd64
   sudo update-java-alternatives --set temurin-8-jdk-amd64
   sudo apt install texlive-base texlive-xetex texlive-lang-all fonts-freefont-ttf fonts-noto
   ```

2. Install packages:
   ```bash
   bundle install
   yarn install
   ```

3. Copy configuration files:

   ```bash
   cp config/database.example.yml config/database.yml
   cp config/datacite.example.yml config/datacite.yml
   ```

4. Adapt the database.yml according to your MySQL configuration and setup the databases:

   ```bash
   bin/rake db:setup
   ```

5. Create initial admin user:

   ```bash
   bin/rake user:create['alice@example.com','password','Alice','Tester']
   ```

## Starting the Application

You can either start Solr, the Rails server and the Webpack dev server separately in three
terminals (this is better for Rails debugging with Byebug):

```bash
bin/start_app
bin/start_search
bin/shakapacker-dev-server
```

Or you can use foreman to start all three servers at once (Foreman runs the commands
in Procfile):

```bash
foreman start
```

Now you should be able to load the OHD portal startpage at

http://localhost:3000

or

http://portal.oral-history.localhost:3000

respectively.

## Routing/ Domains

We use fixed domains in the routing process.
If you want to use other domains (you have to, at least in production) you have to change these domains
in the following files in your app-directory:

```bash
app/javascript/modules/constants/index.js
config/initializers/constants.rb
config/initializers/oai_repository.rb
```

Further you need an entry in your /etc/hosts file like this:

```bash
127.0.0.1 portal.oral-history.localhost
```

It is possible to set fixed domains for other archives/ projects in your instance.
If a project does not have an own domain routing will happen via the projects shortname in the path.

To set an own domain on a specific project you can update it as follows in the rails console:

```ruby
Project.where(shortname: 'yourprojectsshortname').update(archive_domain: 'http://specific-project.localhost:3000')
```

## Caching and Reindexing

To activate caching in development (which is recommended at the moment), run:

```bash
touch tmp/caching-dev.txt
```

For reindexing the search index, run:

```bash
bin/rake sunspot:reindex
```

## Solr configuration in production

The Solr configuration is saved in *solr/configsets/sunspot/conf/schema.xml*.
The configuration is automatically picked up when using Sunspot Solr in
development but needs to be set up by hand in staging or production.

Two changes to the original config file have been made so far:
* charFilter with "mapping-ISOLatin1Accent.txt" for folding diacritical characters
* GermanLightStemFilter for analyzing German language

## Tests

See above for basic dependencies, then prepare the environment for
testing:

* `npm install --legacy-peer-deps`
* foreman start

Foreman also starts the development servers as they can be shared with the test
environment. With that out of the way, run all tests:

    bundle exec rails test -v test/
    bundle exec rails test -v test/system

Additional features of the test suite can be controlled with environment
variables:

* set COVERAGE=true to generate a coverage report to `tmp/coverage/index.html`
* set RETRY=true to rerun failed tests up to 3 times
* set HEADLESS=true to run the e2e tests in a headless browser

There is also a script to run all tests in an unattended fashion (with RETRY
and HEADLESS):

    bin/test
