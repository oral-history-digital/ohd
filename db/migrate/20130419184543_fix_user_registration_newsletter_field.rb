class FixUserRegistrationNewsletterField < ActiveRecord::Migration

  def self.up
    # cleanup of created_at datetime values
    say_with_time 'cleanup of incorrect datetime values in user_registrations.created_at' do
      Rake::Task['cleanup:user_creation_dates'].execute
    end

    change_table :user_registrations do |t|
      t.boolean :newsletter_signup, :default => false
    end
    # update
    index = 0
    STDOUT.printf "Updating subscriptions"
    STDOUT.flush
    UserRegistration.find_each do |u|
      value = u.read_attribute(:receive_newsletter)
      if value
        success = UserRegistration.update_all ['newsletter_signup = ?', true], "id = #{u.id}"
        index += 1 if success > 0
        if index % 25 == 0
          STDOUT.printf '.'
          STDOUT.flush
        end
      end
    end
    puts "\nUpdated #{index} user_registrations to apply newsletter settings."
  end

  def self.down
    remove_column :user_registrations, :newsletter_signup
  end

end
