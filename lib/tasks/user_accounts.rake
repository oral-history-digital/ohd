namespace :user_accounts do

    namespace :import do

      task :from_yaml, [:file] => :environment do |task, args|

        file = args[:file] || ENV['file']
        raise "No file argument specified (file=). Aborting." if file.nil?
        raise "No such file: #{file}. Try again." unless File.exists?(file)

        puts 'KCODE: ' + (ENV['KCODE'] || 'none').to_s
        raise "Please set $KCODE to 'u' before importing" if ENV['KCODE'].nil? || ENV['KCODE'].downcase[/^u/].blank?

        puts "Importing data from #{file}..."

        invalid_records = []

        record_number = 0

        YAML::load_file(file).each_pair do |login, attributes|
          record_number += 1
          valid_record = true
          %w(encrypted_password mail given_name surname login).each do |check_attribute|
            valid_record = false if attributes[check_attribute].nil?
          end
          unless valid_record
            invalid_records << attributes
            next
          end
          user = UserAccount.find_or_initialize_by_login_and_email(attributes['login'].strip, attributes['mail'].strip)
          if user.new_record?
            user.encrypted_password = attributes['encrypted_password'].sub('{SSHA}','')
            user.password_salt = Base64.encode64(Base64.decode64(user.encrypted_password)[-4,4])
            begin
              user.save!
            rescue StandardError => e
              puts "ERROR: #{e.message}\n#{user.inspect}\n#{user.errors.full_messages}\n"
              next
            end
            STDOUT.printf '.'
            STDOUT.flush
          end
        end

        UserAccount.update_all "confirmed_at = '#{Time.now.to_s(:db)}', confirmation_sent_at = '#{Time.now.to_s(:db)}'"

        puts "#{invalid_records.size} errors:\n#{invalid_records.map{|r| r.inspect}.join("\n")}" unless invalid_records.empty?

        puts "done. #{record_number} records read in total."

      end

    end

end

























