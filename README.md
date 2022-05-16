# Interview Archive

This is the Interview Archive Web Application

## Application Setup

1. generate the **database.yml** and setup the databases (`bundle exec rake db:setup`)

2. set symbolic link from the project file to config/project.yml:

    ```bash
    cd config
    ln -s projects/mog.yml project.yml
    # or
    ln -s projects/zwar.yml project.yml
    # or
    ln -s projects/dg.yml project.yml
    # or for a new empty project
    ln -s projects/empty.yml project.yml
    ```

3. Create datacite.yml:

   ```bash
   cp config/datacite.example.yml config/datacite.yml
   ```

4. create initial admin users: `bundle exec rake users:init_admins`
   (have a look in lib/tasks/users.rb after l.34 to add other users)

5. To use node.js (at the moment version 8.x) for webpacker run:

    ```bash
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

6. install yarn ( as well to run webpacker )

    ```bash
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt-get update && sudo apt-get install yarn
    yarn install
    ```
7. Install Java

   [https://wiki.ubuntuusers.de/Java/Installation/](https://wiki.ubuntuusers.de/Java/Installation/)

   e.g.:
   ```bash
   sudo apt install openjdk-13-jre
   ```

8. Install redis

   ```bash
   sudo apt-get install redis-server
   ```

9. Recommended: Activate caching in deployment (depending on what you are about to work on):

   ```bash
   touch tmp/caching-dev.txt
   ```
   In order to delete all cache kay-value-pairs for the current project, you can do the following:

   ```bash
   redis-cli --raw keys "zwar-*" | sed -e 's/$/"/' | sed -e 's/^/"/' | xargs redis-cli del
   ```


## Start app using foreman

Normally you would have to start solr (`bundle exec rake solr:start`), rails server (`bundle exec rails s`) and a webpack dev server (`./bin/webpack-dev-server`) to compile js-resources.
To prevent you having to manage all this stuff in three different terminals, just type:

```bash
foreman start
```

Foreman will run every command from **Procfile**.

## Solr Setup and Indexing

Try to start the Solr server in the Jetty container by running:

```bash
bundle exec rake sunspot:solr:start
```

There is no output on either success or failure, but checking for a solr process will give some info:

```bash
ps ax | grep solr
```

In case of problems, there's a test rake task for starting up the Solr server with STDERR output:

```bash
bundle exec rake solr:start
```

MOG only: Before indexing run rake task to validate the presence of periods:

```bash
bundle exec rake dedalo:validate_periods
```

When the Solr server is running, you can index the data:

```bash
bundle exec rake solr:reindex:all
```

## PDF Generation with Latex
rails-latex.gem is used for generating pdfs.
Make sure that textlive-base and texlive-xetex is installed.
```bash
sudo apt-get install texlive-base
sudo apt-get install texlive-xetex
```
The font FiraSans-Regular.ttf is used and should be installed as well.


## Switch project in development

Example: Switch from `mog` to `zwar`:

1. In **solr.xml**, change

    ```xml
    <core name="default" instanceDir="." dataDir="data/mog"/>
    ```

    to

    ```xml
    <core name="default" instanceDir="." dataDir="data/zwar"/>
    ```

2. In **database.yml** switch to zwar database:

    ```yml
    ...
    development:
        adapter: mysql2
        encoding: utf8
        reconnect: false
        database: zwar_archive_development
        ...
    ```

3. Link project.yml to zwar project file:

    ```bash
    cd config
    rm project.yml
    ln -s projects/zwar.yml project.yml
    ```

## Deployment

3. Deploy the code with
    ```bash
    cap zwar_archive deploy
    ```

4. Restart solr on the deployed app after every deploy
    ```bash
    cd /data/applications/zwar_archive/current
    bundle exec rake sunspot:solr:stop
    # verify that port 9001 has been killed
    bundle exec rake sunspot:solr:start
    ```

## After release of new data on the live DB

1. On the server, do a reindex:

    ```bash
    RAILS_ENV=production bundle exec rake solr:reindex:all
    ```

2. Optionally, remove all redis cache key-value-pairs for the project, e.g.:

    ```bash
    redis-cli --raw keys "mog-*" | sed -e 's/$/"/' | sed -e 's/^/"/' | xargs redis-cli del
    ```


## Running end-to-end tests

1. Place a **.env** file in the project root containing http auth credentials,
e.g.:

```
OHD_PROD_USERNAME=...
OHD_PROD_PASSWORD=...
```

2. Start Cypress: ```yarn cypress:open``` and run test **after_deploy_spec.js**
or run ```yarn cypress:deploy``` to run the test in the console.

Optional: setting the environment variable (for example in your ~/.bashrc file) ```export CYPRESS_CRASH_REPORTS=0``` prevents Cypress from sending error reports to the company.
