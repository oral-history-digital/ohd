# config valid only for current version of Capistrano
lock "3.11.0"

set :repo_url, "git@gitlab.cedis.fu-berlin.de:dis/zwar-archive.git"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
# set :branch, :development

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
append :linked_files, "config/database.yml", "config/secrets.yml", "config/sunspot.yml", "config/datacite.yml"

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"
append :linked_dirs, "solr", "node_modules"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
set :keep_releases, 2

# Which project file from the projects directory to copy to config/project.yml.
# Overwrite this in stage configuration, please.
set :project_yml, 'empty.yml'

namespace :deploy do
  desc 'Copy correct project file into config directory'

  task :copy_project_file do
    on roles(:app) do
      execute :cp, release_path.join('config', 'projects', "#{fetch(:project_yml)}"), release_path.join('config', 'project.yml')
    end
  end

  before :updated, 'copy_project_file'
end
