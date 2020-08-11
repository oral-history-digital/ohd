class DeletePersonalDataInUserAccountsAndUserRegistration < ActiveRecord::Migration[5.2]
  def up
      Rails.application.config.devise.reconfirmable = false
      if Rails.application.config.devise.reconfirmable == false
         obsolete_registrations = UserRegistration.where(workflow_state: 'checked').where('processed_at < ?', 2.weeks.ago)
         more_obsolete_registrations = UserRegistration.where(workflow_state: ['checked', 'postponed', 'rejected']).where('created_at < ?', 4.weeks.ago)
         obsolete_account_ids = obsolete_registrations.pluck(:user_account_id)
         more_obsolete_account_ids = more_obsolete_registrations.pluck(:user_account_id)
         account_ids = obsolete_account_ids + more_obsolete_account_ids

         attributes = { encrypted_password: "",
                        password_salt: "",
                        reset_password_token: nil,
                        deactivated_at: DateTime.now,
                        admin: nil,
                        first_name: nil,
                        last_name: nil,
                        appellation: nil,
                        comments: nil,
                        organization: nil,
                        homepage: nil,
                        street: nil,
                        zipcode: nil,
                        city: nil,
                        state: nil,
                        tos_agreed_at: nil,
                        updated_at: nil,
                        priv_agreement: nil,
                        tos_agreement: nil,
                        receive_newsletter: nil,
                        default_locale: nil,
                        admin_comments: nil,
                        processed_at: nil,
                        activated_at: nil
                      }

       accounts = UserAccount.where(user_registration: account_ids)
       accounts.update_all(attributes)
       accounts.each do |account|
         account.update_attributes(email: "#{account.id}@example.org", unconfirmed_email: "#{account.id}@example.org", login: "#{account.id}", confirmation_token: account.id)
       end
       obsolete_registrations.destroy_all
       leftover_obsolete_registrations = UserRegistration.where(workflow_state: ['checked', 'postponed', 'rejected']).where('created_at < ?', 4.weeks.ago)
       leftover_obsolete_registrations.destroy_all

       Rails.application.config.devise.reconfirmable = true
     end
  end
  def down
  end
end
