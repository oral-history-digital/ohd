server "deploy_da03", roles: %w{app db web}

set :application, "mog_archive"
set :stage, :production
set :deploy_to, "/data/applications/#{fetch :application}"
set :bundle_path, "/data/bundle/01"
set :project_yml, "mog.yml"
set :branch, ENV.fetch('BRANCH', 'release/mog')

set :rbenv_type, :system
set :rbenv_ruby, '2.7.7'
set :rbenv_custom_path, '/opt/rbenv'
