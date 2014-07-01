require 'bundler/capistrano'

set :repository, 'https://dev.cedis.fu-berlin.de/svn/eaz/zwar_archive/branches/integration'
set :environment, :production
set :scm, 'subversion'
set :use_sudo, false

set :deploy_via, :remote_cache
set :copy_exclude, ['.git/*', '.svn/*', '.DS_Store', 'deploy.rb', 'production.rb', 'Capfile', 'database.yml', 'solr.yml', 'sunspot.yml']
set :bundle_dir, '/data/bundle/01'

set :keep_releases, 6

desc 'prepare to act on the production environment'
task :production do
  set :application, :zwar_archiv
  set :project, :zwar
  set :deploy_to, "/data/applications/#{application}"
  role :app, 'da01.cedis.fu-berlin.de'
  role :web, 'da01.cedis.fu-berlin.de'
  role :db, 'da01.cedis.fu-berlin.de', :primary => true
end

desc 'prepare to act on the staging environment (ZWAR)'
task :zwar_staging do
  set :application, :zwar_archiv
  set :project, :zwar
  set :deploy_to, "/data/applications/staging/#{application}"
  role :app, '160.45.170.50'
  role :web, '160.45.170.50'
  role :db, '160.45.170.50', :primary => true
end

desc 'prepare to act on the staging environment (Hagen)'
task :hagen_staging do
  set :application, :hagen_archiv
  set :project, :hagen
  set :deploy_to, "/data/applications/staging/#{application}"
  role :app, '160.45.170.50'
  role :web, '160.45.170.50'
  role :db, '160.45.170.50', :primary => true
end

# deploy restart: restart apache
namespace :deploy do

  desc 'restart the server stack'
  task :restart, :roles => :app do
    run "touch #{current_release}/tmp/restart.txt"
  end

  task :symlink_configuration, :roles => :app do
    %w{database.yml sunspot.yml environments/production.rb}.each do |config|
      run "rm -f #{release_path}/config/#{config}"
      run "ln -s #{shared_path}/config/#{config} #{release_path}/config/#{config}"
      run "ln -nfs #{shared_path}/solr/data #{release_path}/solr/data"
    end
    # project configuration
    run "rm -f #{release_path}/config/project.yml"
    run "ln -s #{release_path}/config/projects/#{project}.yml #{release_path}/config/project.yml"
    # stills
    run "rm -rf #{release_path}/assets/archive_images"
    run "ln -s #{shared_path}/assets/archive_images #{release_path}/assets/archive_images"
    # text_materials
    run "rm -rf #{release_path}/assets/archive_text_materials"
    run "ln -s #{shared_path}/assets/archive_text_materials #{release_path}/assets/archive_text_materials"
    # reports
    run "rm -rf #{release_path}/assets/reports"
    run "ln -s #{shared_path}/assets/reports #{release_path}/assets/reports"
  end

  task :rewrite_stylesheet_urls, :roles => :app do
    # this places a /archiv before each image url
    Dir.glob(File.join(File.dirname(__FILE__), '..', 'public', 'stylesheets', '*.css')).each do |file|
      stylesheet = file.split('/').last
      run "sed 's/\\/images/\\/archiv\\/images/g' #{current_release}/public/stylesheets/#{stylesheet} > #{current_release}/public/stylesheets/#{stylesheet}.new"
      run "mv #{current_release}/public/stylesheets/#{stylesheet}.new #{current_release}/public/stylesheets/#{stylesheet}"
    end
  end

  task :disable_web, :roles => :web do
    # invoke with
    # UNTIL="16:00 MST" REASON="a database upgrade" cap deploy:web:disable

    on_rollback { rm "#{shared_path}/system/maintenance.html" }

    require 'erb'
    puts 'Wartungsarbeiten im Online-Archiv'
    set(:reason) { Capistrano::CLI.ui.ask("Die Seite ist zur Zeit nicht erreichbar wegen: ['Wartungsarbeiten'] ")}
    set(:deadline) { Capistrano::CLI.ui.ask('Voraussichtlich bis: [unabsehbar] ')}
    maintenance = ERB.new(File.read('./app/views/layouts/maintenance.html.erb'), nil, '%').result(binding)

    put maintenance, "#{shared_path}/system/maintenance.html", :mode => 0644
  end

  task :enable_web, :roles => :web do
    run "rm #{shared_path}/system/maintenance.html"
  end

end

after 'deploy:update_code', 'deploy:symlink_configuration'
after 'deploy:update_code', 'deploy:rewrite_stylesheet_urls'
