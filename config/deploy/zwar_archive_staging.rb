server "deploy_da03", roles: %w{app db web}

set :application, "zwar_archive_staging"
#set :branch, :development
set :branch, 'deploy/prepare_zwar_live'
set :stage, :production
set :deploy_to, "/data/applications/#{fetch :application}"
set :bundle_path, "/data/bundle/01"
set :project_yml, "zwar_staging.yml"

#set :default_env, {
#      'project_name' => fetch(:application)
#    }

set :rbenv_type, :system
set :rbenv_ruby, '2.5.3'
set :rbenv_custom_path, '/opt/rbenv'
