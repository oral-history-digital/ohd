class AuthenticationModel < ActiveRecord::Base

  # Authentication Models are handles via connections to
  # the separate authentication database.

  self.abstract_class = true

  require 'yaml'
  auth_settings = ENV['RAILS_ENV'] == 'test' ? 'authentication_test' : 'authentication'
  DB_CONFIG = YAML::load_file(File.join(RAILS_ROOT, 'config/database.yml'))[auth_settings]

  # establish connection on loading the class
  establish_connection(DB_CONFIG)

#  def self.establish_connection_to_auth_db(env)
#    require 'yaml'
#    self.establish_connection(DB_CONFIG[env])
#  end
#
#  def self.establish_connection_to_db(env)
#    require 'yaml'
#    self.establish_connection(DB_CONFIG[env].dup.merge({'database' => nil}))
#  end

end