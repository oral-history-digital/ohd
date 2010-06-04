class AuthDbGenerator < Rails::Generator::NamedBase

  def manifest

    record do |m|

      @env = class_name.downcase
      raise 'No such environment: ' + @env unless %w(development test production).include?(@env)

      @options = AuthenticationModel::DB_CONFIG.dup.merge({:charset => 'utf8', :collation => 'utf8_unicode_ci'})

      begin
        #AuthenticationModel.establish_connection_to_db(@env)
        AuthenticationModel.connection.create_database(@options['database'], @options)
      rescue Exception => e
        puts "Couln't create database for #{@options.inspect}:\n#{e.message}"
      end
      
      #AuthenticationModel.establish_connection_to_auth_db(@env)

      require 'active_record/migration'

      migration = returning(ActiveRecord::MigrationProxy.new) do |mig|
        mig.name = 'DbSetup'
        mig.version = '20100520000000'
        mig.filename = File.join(File.dirname(__FILE__), '20100520000000_db_setup.rb')
      end

      # make sure to connect to the authentication DB
      ActiveRecord::Base.establish_connection(@options)

      migration.migrate(:up)

    end

  end
  
end