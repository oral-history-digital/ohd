# server-based syntax
# ======================
# Defines a single server with a list of roles and multiple properties.
# You can define all roles on a single server, or split them:

server "160.45.168.36", user: "deploy", roles: %w{app db web}#, my_property: :my_value
#server "da02.cedis.fu-berlin.de", user: "deploy", roles: %w{app web}#, other_property: :other_value
#server "dedalo.cedis.fu-berlin.de", user: "cgregor", roles: %w{db}

set :application, "zwar"

set :branch, :development

set :stage, :production
set :user, 'deploy'
#set :bundle_path, "/data/bundle/02"

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "/data/applications/zwar_testplattform"

set :default_env, { 
    'project_name' => fetch(:application)
  }

# rbenv settings
set :rbenv_type, :system
set :rbenv_ruby, '2.4.0'
set :rbenv_custom_path, '/opt/rbenv'
