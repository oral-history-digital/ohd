set :application, "zwar_archiv"
set :repository,  "https://dev.cedis.fu-berlin.de/svn/eaz/zwar_archive/trunk"
set :user, "jrietema"
set :use_sudo, false

set :deploy_to, "/data/applications/zwar/#{application}"
set :deploy_via, :remote_cache
set :copy_exclude, [".git/*", ".svn/*", ".DS_Store", "deploy.rb", "production.rb", "Capfile", "database.yml", "solr.yml", "sunspot.yml"]

set :environment, :undefined

set :keep_releases, 3

desc "prepare to act on the production environment"
task :production do
  set :environment, :production
  set :application, 'zwar_archiv'
  set :deploy_to, "/data/applications/#{application}"
  role :app, "da01.cedis.fu-berlin.de"
  role :web, "da01.cedis.fu-berlin.de"
  role :db,  "da01.cedis.fu-berlin.de", :primary => true
end

desc "prepare to act on the demo server"
task :demo do
  set :environment, :demo
  set :application, 'demo'
  set :deploy_to, "/data/applications/zwar/#{application}"
  role :app, "fnf.cedis.fu-berlin.de"
  role :web, "fnf.cedis.fu-berlin.de"
  role :db, "fnf.cedis.fu-berlin.de"
end

desc "prepare to act on the test environment (the old bb-app-02 server that is going to be dropped)"
task :staging do
  set :environment, :production
  set :application, 'zwar_archiv'
  set :deploy_to, "/data/applications/#{application}"
  role :app, "160.45.168.27"
  role :web, "160.45.168.27"
  role :db,  "da01.cedis.fu-berlin.de", :primary => true
end

desc "prepare to act on the test environment (shared with the bugtracker)"
task :testing do
  set :user, 'root'
  set :environment, :development
  set :application, 'archive_test'
  set :deploy_to, "/home/ruby/#{application}"
  role :app, "160.45.170.231"
  role :web, "160.45.170.231"
  role :db,  "160.45.170.231", :primary => true
end

# deploy restart: restart apache
namespace :deploy do

  # this task checks to see if we know what we're doing
  task :check_environment do
    if environment == :undefined
      puts "\nWARNING: deploy environment is not defined."
      puts "use 'cap <environment> <task>' to provide an environment."
      Kernel.exit
    end
  end

  task :symlink_configuration, :roles => :app do
    %w{database.yml sunspot.yml environments/production.rb}.each do |config|
      run "rm -f #{release_path}/config/#{config}"
      run "ln -s #{shared_path}/config/#{config} #{release_path}/config/#{config}"
      run "ln -nfs #{shared_path}/solr/data #{release_path}/solr/data"
    end
    run "rm -rf #{release_path}/assets/archive_images"
    run "ln -s #{shared_path}/assets/archive_images #{release_path}/assets/archive_images"
    run "cp #{release_path}/db/import_files/missing_still.png #{release_path}/assets/archive_images"
    # text_materials
    run "rm -rf #{release_path}/assets/archive_text_materials"
    run "ln -s #{shared_path}/assets/archive_text_materials #{release_path}/assets/archive_text_materials"
    # symlink the prebuilt unicode gem
    run "rm -rf #{release_path}/vendor/gems/unicode-0.3.1"
    if environment == :demo
      run "ln -s #{shared_path}/vendor/gems/unicode-0.3.1 #{release_path}/vendor/gems/unicode-0.3.1"
    end
  end

  task :rewrite_stylesheet_urls, :roles => :app do
    if environment == :production
      # this places a /archiv before each image url
      Dir.glob(File.join(File.dirname(__FILE__), '..', 'public', 'stylesheets', '*.css')).each do |file|
        stylesheet = file.split('/').last
        run "sed 's/\\/images/\\/archiv\\/images/g' #{current_release}/public/stylesheets/#{stylesheet} > #{current_release}/public/stylesheets/#{stylesheet}.new"
        run "mv #{current_release}/public/stylesheets/#{stylesheet}.new #{current_release}/public/stylesheets/#{stylesheet}"
      end
    end
    if environment == :demo
      # this places a /demo before each image url
      Dir.glob(File.join(current_release, 'public', 'stylesheets', '*.css')).each do |file|
        stylesheet = file.split('/').last
        run "sed 's/\\/images/\\/demo\\/images/g' #{current_release}/public/stylesheets/#{stylesheet} > #{current_release}/public/stylesheets/#{stylesheet}.new"
        run "mv #{current_release}/public/stylesheets/#{stylesheet}.new #{current_release}/public/stylesheets/#{stylesheet}"
      end
    end
  end

  desc "restart the server stack"
  task :restart, :roles => :app do
    if environment == :staging
      run "apache2ctl restart"
    else
      run "touch #{current_release}/tmp/restart.txt"
    end
  end

  task :disable_web, :roles => :web do
    # invoke with
    # UNTIL="16:00 MST" REASON="a database upgrade" cap deploy:web:disable

    on_rollback { rm "#{shared_path}/system/maintenance.html" }

    require 'erb'
    puts "Wartungsarbeiten im Online-Archiv 'Zwangsarbeit 1939-1945':"
    set(:reason) { Capistrano::CLI.ui.ask("Die Seite ist zur Zeit nicht erreichbar wegen: ['Wartungsarbeiten'] ")}
    set(:deadline) { Capistrano::CLI.ui.ask("Voraussichtlich bis: [unabsehbar] ")}
    maintenance = ERB.new(File.read("./app/views/layouts/maintenance.html.erb"), nil, "%").result(binding)

    put maintenance, "#{shared_path}/system/maintenance.html", :mode => 0644
  end

  task :enable_web, :roles => :web do
    run "rm #{shared_path}/system/maintenance.html"
  end


end

after "deploy:update_code", "deploy:symlink_configuration"
after "deploy:update_code", "deploy:rewrite_stylesheet_urls"