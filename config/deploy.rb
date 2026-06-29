require 'stringio'

# config valid only for current version of Capistrano
lock "3.17.3"

set :repo_url, "https://github.com/oral-history-digital/ohd.git"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
set :branch, ENV.fetch('BRANCH', 'main')

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Legacy source-based Capistrano release symlinks (not used by docker:deploy).
# Default value for :linked_files is []
set :linked_files, %w(config/database.yml config/secrets.yml config/sunspot.yml config/datacite.yml config/storage.yml config/master.key)

# Legacy source-based Capistrano release symlinks (not used by docker:deploy).
# Default value for linked_dirs is []
# set :linked_dirs, (log tmp/pids tmp/cache tmp/sockets public/system)
set :linked_dirs, %w(solr node_modules tmp/pids tmp/files tmp/cache log config/hls public/favicons)

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
set :keep_releases, 5

# Legacy source-based setting for project.yml copy during release updates.
# Overwrite this in stage configuration, please.
set :project_yml, 'empty.yml'

namespace :deploy do
  # Legacy source-based step: copies project.yml into the release path.
  desc 'Copy correct project file into config directory'
  task :copy_project_file do
    on roles(:app) do
      execute :cp, release_path.join('config', 'projects', "#{fetch(:project_yml)}"), release_path.join('config', 'project.yml')
    end
  end

  # Legacy source-based hooks (not used by docker:deploy).
  before :updated, 'copy_project_file'
  before :updated, 'yarn:install'
end

namespace :yarn do
  # Legacy source-based dependency install in release_path.
  desc 'Install yarn dependencies'
  task :install do
    on roles(:app) do
      within release_path do
        execute :yarn, 'install', '--production', '--frozen-lockfile', '--ignore-engines', '--network-timeout', '600000'
      end
    end
  end
end
