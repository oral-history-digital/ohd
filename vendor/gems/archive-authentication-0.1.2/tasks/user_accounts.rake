require(File.join(File.dirname(__FILE__),'../../../..', 'config', 'boot'))

require 'rake/rdoctask'
require 'tasks/rails'

namespace :user_accounts do

    namespace :import do

      task :from_yaml, [:file] => :environment do |task, args|

        file = args[:file] || ENV['file']
        raise "No file argument specified (file=). Aborting." if file.nil?
        raise "No such file: #{file}. Try again." unless File.exists?(file)

        puts 'KCODE: ' + (ENV['KCODE'] || 'none').to_s
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
            user.encrypted_password = attributes['encrypted_password'].sub('{SSHA}','')
            user.password_salt = Base64.encode64(Base64.decode64(user.encrypted_password)[-4,4])
            user.save!
            STDOUT.printf '.'
            STDOUT.flush
          end
        end

        UserAccount.update_all "confirmed_at = '#{Time.now.to_s(:db)}', confirmation_sent_at = '#{Time.now.to_s(:db)}'"

      end

    end

end

























