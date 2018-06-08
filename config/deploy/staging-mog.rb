server "160.45.168.44", user: "deploy", roles: %w{app db web}

set :stage, :staging
set :user, 'deploy'

set :deploy_to, "/data/applications/production/occupation-memories.org"

set :rbenv_type, :system
set :rbenv_ruby, '2.4.0'
set :rbenv_custom_path, '/usr/local/rbenv'
