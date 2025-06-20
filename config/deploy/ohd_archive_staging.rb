server "deploy_da03", roles: %w{app db web}

set :application, "ohd_archive_staging"
set :stage, :staging
set :deploy_to, "/data/applications/#{fetch :application}"
set :bundle_path, "/data/bundle/01"
set :project_yml, "ohd_archive_staging.yml"
set :branch, ENV.fetch('BRANCH', 'ruby-3.4-rails-8.0.2')

set :rbenv_type, :system
set :rbenv_ruby, '3.3.4'
set :rbenv_custom_path, '/opt/rbenv'
