# Oral History.Digital

A curation and research platform for scholarly collections of audio-visual narrative interviews.

https://www.oral-history.digital/

We have only recently released this software as Open Source.
At the moment, you can set up the OHD software in your development environment.
Without any modifications, it is probably not yet suitable for running in
production without any modifications.

## Prerequisites

* Ruby 2.7.7
* MySQL/MariaDB
* Node.js 16
* yarn
* Java Runtime Environment
* optional: LaTeX for PDF generation (e.g. texlive-base and texlive-xetex packages for Ubuntu)

## Application Setup

This is how to setup the OHD archive software in your development environment
on Linux.

1. Install packages:
   ```bash
   bundle install
   yarn install
   ```

2. Copy configuration files:

   ```bash
   cp config/database.example.yml config/database.yml
   cp config/datacite.example.yml config/datacite.yml
   ```

3. Adapt the database.yml according to your MySQL configuration and setup the databases:
   ```bash
   bin/rake db:setup
   ```

4. Create initial admin user:

   ```bash
   bin/rake user:create['alice@example.com','password','Alice','Tester']
   ```


## Starting the Application

You can either start Solr, the Rails server and the Webpack dev server separately in three
terminals (this is better for Rails debugging with Byebug):

```bash
bin/start_app
bin/start_search
bin/webpack-dev-server
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


## Caching and Reindexing

To activate caching in development (which is recommended at the moment), run:

```bash
touch tmp/caching-dev.txt
```

For reindexing the search index, run:

```bash
bin/rake sunspot:reindex
```

## Tests

See above for basic dependencies, then ensure prepare the environment for 
testing:

* `npm install --legacy-peer-deps`
* run the solr instance (`RAILS_ENV=test bundle exec sunspot:solr:run`)
* run the wepack dev server (`bin/wepack-dev-server`)

With that out of the way, run all tests:

    bundle exec rails test -v test/system
