require(File.join(File.dirname(__FILE__),'../../../..', 'config', 'boot'))

require 'rake/rdoctask'
require 'tasks/rails'

namespace :user_accounts do

    namespace :import do

      task :from_yaml, [:file] => :environment do |task, args|

        file = args[:file] || ENV['file']
        raise "No file argument specified (file=). Aborting." if file.nil?
        raise "No such file: #{file}. Try again." unless File.exists?(file)

        puts 'KCODE: ' + ENV['KCODE']
        raise "Please set $KCODE to 'u' before importing" if ENV['KCODE'].nil? or ENV['KCODE'].downcase[/^u/].blank?

        puts "Importing data from #{file}..."

        YAML::load_file(file).each_pair do |login, attributes|
          valid_record = true
          %w(encrypted_password mail given_name surname login).each do |check_attribute|
            valid_record = false if attributes[check_attribute].nil?
          end
          next unless valid_record
          user = UserAccount.find_or_initialize_by_login_and_email(attributes['login'], attributes['mail'])
          if user.new_record?
            user.save!
            STDOUT.printf '.'
            STDOUT.flush
            encrypted_password = attributes['encrypted_password'].sub('{SSHA}','')
            password_salt = Base64.decode64(encrypted_password)[/.{4}$/]
            UserAccount.update_all ActiveRecord::Base.send(:sanitize_sql_array, ["encrypted_password = '%s', password_salt = '%s'",encrypted_password, password_salt]),
                                   ['id = ?', user.id]
            user.reload
            # update the confirmation process
            user.confirm!
          end
        end

      end

    end

end