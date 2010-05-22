class AuthenticationModel < ActiveRecord::Base

  # Authentication Models are handles via connections to
  # the separate authentication database.

  self.abstract_class = true

  require 'yaml'
  DB_CONFIG = YAML::load_file(File.join(File.dirname(__FILE__), '../../config/database.yml'))

  # establish connection on loading the class
  establish_connection(DB_CONFIG[RAILS_ENV || 'test'])

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