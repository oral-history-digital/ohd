server "deploy_da03", roles: %w{app db web}

set :application, "ohd_archive_staging"
set :stage, :staging
set :deploy_to, "/data/applications/#{fetch :application}"
# Legacy source-based Capistrano setting (kept for backward compatibility).
set :bundle_path, "/data/bundle/01"
# Legacy source-based Capistrano setting (project.yml copy during release).
set :project_yml, "ohd_archive_staging.yml"
set :branch, ENV.fetch('BRANCH', 'staging')

# Legacy source-based Capistrano/rbenv settings (Docker deploy path does not use host Ruby runtime).
set :rbenv_type, :system
set :rbenv_ruby, '3.3.4'
set :rbenv_custom_path, '/opt/rbenv'

# Docker Compose deployment settings
set :docker_compose_dir, -> { "#{fetch(:deploy_to)}/current" }
set :docker_compose_file, 'docker-compose.yml'
set :docker_compose_project_name, 'ohd_archive_staging'
set :docker_services, %w(app worker)
set :docker_migration_service, 'app'
set :docker_run_migrations, true
