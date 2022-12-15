server "deploy_da03", roles: %w{app db web}

set :application, "ohd_archive_staging"
set :stage, :staging
set :branch, 'sso'
set :deploy_to, "/data/applications/#{fetch :application}"
set :bundle_path, "/data/bundle/01"
set :project_yml, "ohd_archive_staging.yml"

#set :default_env, {
#      'project_name' => fetch(:application)
#    }

set :rbenv_type, :system
set :rbenv_ruby, '2.6.6'
set :rbenv_custom_path, '/opt/rbenv'
