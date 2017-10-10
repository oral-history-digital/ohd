# CeDiS Archive 2.0+

This is the web application for CeDiS-Archiv 2.0.

## Application Setup

1. generate the **database.yml** and setup the databases (`bundle exec rake db:create` or `bundle exec rake db:create:all`)
2. run the migrations: `bundle exec rake db:migrate`
3. set environment variable `EAZ_PROJECT_NAME` to `'hagen'` or `'zwar'`. 
   e.g. add the following line to your **~/.bashrc** or **~/.profile** or similar:

    ```bash
    export EAZ_PROJECT_NAME="zwar"
    ```
    and source it afterwards, e.g.:
   
    ```bash
    source ~/.bashrc
    ```
4. Mount **//eaz-diga.cedis.fu-berlin.de/data** to **/mnt/eaz-diga.cedis.fu-berlin.de/data** as described in **project.yml**

5. Import interviews
   ```bash
   bundle exec rake import:interviews:full
   ```
6. To use node.js (at the moment version 8.x) for webpacker run:
 
    ```bash
     curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
     sudo apt-get install -y nodejs
    ```
    
7. install yarn ( as well to run webpacker )

    ```bash
     curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
     echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
     sudo apt-get update && sudo apt-get install yarn
     yarn install
    ```
    
## Start app using foreman

Normally you would have to start solr (`bundle exec rake solr:start`), rails server (`bundle exec rails s`) and a webpack dev server (`./bin/webpack-dev-server`) to compile js-resources.
To prevent you having to manage all this stuff in three different terminals, just type:

```bash
foreman start
```

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

When the Solr server is running, you can index the data:

```bash
bundle exec rake solr:reindex:all
```