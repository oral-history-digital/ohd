set :application, "demo"
set :repository,  "https://dev.cedis.fu-berlin.de/svn/eaz/zwar_archive/trunk"
set :user, "jrietema"
set :use_sudo, false

set :deploy_to, "/data/applications/zwar/#{application}"
set :deploy_via, :remote_cache
set :copy_exclude, [".git/*", ".svn/*", ".DS_Store", "deploy.rb", "Capfile", "database.yml", "solr.yml", "sunspot.yml"]

set :environment, :undefined

set :keep_releases, 3

desc "prepare to act on the production environment"
task :production do
  set :environment, :production
  set :deploy_to, "/data/applications/zwar/#{application}"
  role :app, "fnf.cedis.fu-berlin.de"
  role :web, "fnf.cedis.fu-berlin.de"
  role :db,  "fnf.cedis.fu-berlin.de", :primary => true
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
    %w{database.yml solr.yml}.each do |config|
      run "rm -f #{release_path}/config/#{config}"
      run "ln -s #{shared_path}/config/#{config} #{release_path}/config/#{config}"
      run "ln -nfs #{shared_path}/solr/data #{release_path}/solr/data"
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

end

after "deploy:update_code", "deploy:symlink_configuration"