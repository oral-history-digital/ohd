class AuthDbGenerator < Rails::Generator::NamedBase

  def manifest

    record do |m|

      @options = AuthenticationModel::DB_CONFIG.dup.merge({:charset => 'utf8', :collation => 'utf8_unicode_ci'})

      begin
        #AuthenticationModel.establish_connection_to_db(@env)
        AuthenticationModel.connection.create_database(@options['database'], @options)
      rescue Exception => e
        puts "Couln't create database for #{@options.inspect}:\n#{e.message}"
      end
      
      #AuthenticationModel.establish_connection_to_auth_db(@env)

      require 'active_record/migration'
      require 'fileutils'

      migration = returning(ActiveRecord::MigrationProxy.new) do |mig|
        mig.name = 'DbSetup'
        mig.version = '20100520000000'
        mig.filename = File.join(File.dirname(__FILE__), '20100520000000_db_setup.rb')
      end

      # make sure to connect to the authentication DB
      ActiveRecord::Base.establish_connection(@options)

      migration.migrate(:up)


      migration = returning(ActiveRecord::MigrationProxy.new) do |mig|
        mig.name = 'CreateUserRegistration'
        time = Time.now
        mig.version = ''
        %w(year month day hour min sec).each do |interval|
          mig.version << time.send(interval).to_s.rjust(2,'0')
        end
        puts "generating as Migration '#{mig.version}': #{mig.name}"
        mig.filename = File.join(File.dirname(__FILE__), '20100609102820_create_user_registration.rb')
        FileUtils.cp(mig.filename, File.join(RAILS_ROOT, 'db/migrate', "#{mig.version}_create_user_registration.rb"))
        puts "Migration #{mig.version}_create_user_registration.rb added."
      end

      puts "Please run rake db:migrate now."

    end

  end
  
end