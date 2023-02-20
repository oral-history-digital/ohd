namespace :authentication_data do

  # attention: just for analaysis. do not use on production data
  # executing this task produces new records which might break the user statistics
  desc 'report on and maintain authentication data integrity'
  task :maintenance => :environment do

    # first destroy all inconsistent UserRegistrations
    destroyed = UserRegistration.where("user_account_id IS NULL AND workflow_state = 'registered'").each do |r|
      r.destroy
    end.size
    puts "\n#{destroyed} inconsistent registrations removed." if destroyed > 0

    # Phase 1: Remove multiple registrations for the same account
    registrations_deleted = nil
    min_ids =  UserRegistration.select("MIN(id) as id").group(:user_account_id).collect(&:id)
    all_ids = UserRegistration.pluck(:id)
    dup_ids = all_ids - min_ids
    dups = UserRegistration.where(id: dup_ids).destroy_all
    puts "#{dups.size} duplicate registrations deleted." unless dups.empty?

    if dups.empty?
      puts "\nSkipping Phase 1: no duplicate registrations for same account.\n"
    else
      puts "\nFinished Phase 1: removal of duplicate registrations for same account. #{dups.size} User registations were deleted.\n"
    end

    # Phase 2: assign missing users and registrations for accounts
    invalid_user_accounts = []

    batch = 25
    offset = 0
    total = UserAccount.count

    new_registrations = 0
    new_users = 0
    new_users_for_existing_regs = 0

    puts "\nPhase 2: Checking #{total} user accounts for missing users and registrations:"

      UserAccount.all.each do |account|
        next unless account.user.nil? || account.user_registration.nil?
        unless account.user_registration.nil?
          # don't create users if not registered
          next unless account.user_registration.registered?
          # we have a registration, now create a user for them
          begin
            account.user_registration.send(:initialize_user)
            #puts account.user.to_s
            new_users_for_existing_regs += 1
          rescue Encoding::CompatibilityError => e
            puts "\nProblematic Account: #{account.inspect}"
            puts "ERROR: #{e.message}\n"
          end
        else
          # create this user registration

          registration = UserRegistration.where(email: account.email).first_or_initialize

          if registration.new_record?
            new_registrations += 1

            registration.user_account_id = account.id

            name_parts = account.email.split(/[@.]/)
            registration.first_name       = name_parts.first
            registration.last_name        = name_parts[1]
            registration.tos_agreement    = true
            registration.priv_agreement   = true
            registration.workflow_state   = 'registered'

            # application-info:
            registration.appellation      = ''
            registration.job_description  = 'other'
            registration.research_intentions  = 'other'
            registration.comments         = 'keine Angaben'
            registration.organization     = 'keine Angabe'
            registration.homepage         = ''
            registration.street           = 'keine Angabe'
            registration.zipcode          = '--'
            registration.city             = 'keine Angabe'
            registration.country          = 'DE'

            registration.admin_comments   = ''
            registration.processed_at     = Time.now

            registration.skip_mail_delivery!
            registration.send(:serialize_form_parameters)

            # perform_registration(registration)
            begin
              registration.save!
              new_registrations += 1
            rescue => e
              puts "\nINVALID REGISTRATION: #{registration.inspect}"
              puts "ERROR: #{e.message}\n"
              invalid_user_accounts << account
            end
          else
            new_users_for_existing_regs += 1
            #puts "Existing registration: #{registration.inspect}\nfor UserAccount: #{account.inspect}"
          end

          if registration.valid?
            state = account.deactivated_at.nil? ? 'registered' : 'rejected'
            registration.update(workflow_state: state)

            begin
              if registration.user.nil?
                new_users += 1
                registration.send(:initialize_user)
              end

            rescue => e
              puts "ERROR: #{e.message}"
            end
          end

        end

      end

    puts "\nFinished Phase 2. Created #{new_registrations} registrations, #{new_users} users in total and #{new_users_for_existing_regs} users for existing registrations.\n"


    # Phase 3: user -> user_account assignment via user_registrations
    accounts_assigned = nil
    User.where('user_account_id IS NULL').each do |user|
      unless user.user_registration.nil? || user.user_registration.user_account_id.nil?
        user.update_attribute :user_account_id, user.user_registration.user_account_id
        accounts_assigned ||= 0
        accounts_assigned += 1
      end
    end
    if accounts_assigned.nil?
      puts "\nSkipping Phase 3: no users without accounts.\n"
    else
      puts "\nFinished Phase 3: assignment of existing users to accounts. #{accounts_assigned} Accounts were assigned.\n" unless accounts_assigned.nil?
    end


    # Phase 4: two accounts - one registration and user
    # Split these into separate registrations and users
    split_registrations = nil
    UserAccount.all.select{|a| a.user.nil? }.each do |account|
      reg1 = UserRegistration.find_by_email(account.email)
      next if reg1.nil?
      account1 = reg1.user_account
      # Assert that we have a second account with a different email here
      next if account1.id == account.id || reg1.email == account1.email
      registration = reg1.dup
      # modify the email in the existing registration and user
      reg1.email = account1.email
      reg1.save
      if reg1.user.nil?
        reg1.send(:initialize_user)
      else
        reg1.user.email = reg1.email if reg1.user.respond_to?(:email)
      end
      # build an almost identical registration with a different
      # login and user_account_id, we keep the email
      registration.user_account_id = account.id
      registration.save
      registration.send(:initialize_user)
      puts "[#{account.id}] - created registration '#{registration.email}' (#{registration.id})"
      split_registrations ||= 0
      split_registrations += 1
    end
    if split_registrations.nil?
      puts "\nSkipping Phase 4: no duplicate accounts per registration.\n"
    else
      puts "\nFinished Phase 4: split registrations for duplicate accounts. #{split_registrations} registrations were copied and recreated for duplicate accounts.\n" unless split_registrations.nil?
    end


    if invalid_user_accounts.size > 0
      puts "\nPlease remove the following invalid user_accounts and try to find a way of notifying the users:"
      invalid_user_accounts.each do |account|
        puts "[#{account.id}]: #{account.login} (#{account.email})"
      end
    end

    puts "\ncalculating summary... (this may take a while)"

    # Problem scenario reports:
    # A) Accounts where no user could be created
    accounts = UserAccount.all
    no_users = accounts.select{|a| a.user.nil? }
    unless no_users.empty?
      puts "\n#{no_users.size} accounts without users:"
      no_users.each do |account|
        puts "[#{account.id}]: #{account.login} (#{account.email})"
      end
      puts 'These accounts have invalid info and may cause problems!'
    end
    accounts_without_users = no_users.size
    accounts_without_registrations = accounts.select{|a| a.user_registration.nil? }.size

    # B) Users that don't have an assigned user account
    users = User.all
    no_accounts = users.select{|u| u.user_account.nil? }
    unless no_accounts.empty?
      puts "\n#{no_accounts.size} users without accounts:"
      no_accounts.each do |user|
        puts "[#{user.id}]: #{user} (RegId #{user.user_registration_id})"
      end
      puts 'These people cannot log in!'
    end
    users_without_accounts = no_accounts.size
    users_without_registrations = users.select{|u| u.user_registration.nil? }.size

    # C) Registrations that don't have a user
    complete_registrations = UserRegistration.where(workflow_state: 'registered')
    reg_no_users = complete_registrations.select{|r| r.user.nil? }
    unless reg_no_users.empty?
      puts "\n#{reg_no_users.size} completed registrations without user:"
      reg_no_users.each do |reg|
        puts "[#{reg.id}]: #{reg.email} (AccountId: #{reg.user_account_id})"
      end
      puts 'These registrations may cause problems!'
    end
    registrations_without_users = reg_no_users.size

    # D) Registrations that don't have a user account
    reg_no_accounts = complete_registrations.select{|r| r.user_account.nil? }
    unless reg_no_accounts.empty?
      puts "\n#{reg_no_accounts.size} completed registrations without user_account:"
      reg_no_accounts.each do |reg|
        puts "[#{reg.id}]: #{reg.email} (User: #{reg.user} [#{(reg.user || {})[:id]}])"
      end
      puts 'These people cannot log in!'
    end
    registrations_without_accounts = reg_no_accounts.size

    # Print the tabular summary
    # TODO: rather show all registrations than complete ones?
    puts "\nSummary:"
    puts '               Total     |  no user  | no account | no registration'
    puts '-------------------------+-----------+------------+----------------'
    puts "Accounts:      #{accounts.size.to_s.rjust(6,' ')}    |  #{accounts_without_users.to_s.rjust(6,' ')}   |       --   |    #{accounts_without_registrations.to_s.rjust(6,' ')}"
    puts '-------------------------+-----------+------------+----------------'
    puts "Users:         #{users.size.to_s.rjust(6,' ')}    |      --   |   #{users_without_accounts.to_s.rjust(6,' ')}   |    #{users_without_registrations.to_s.rjust(6,' ')}"
    puts '-------------------------+-----------+------------+----------------'
    puts "Registrations: #{UserRegistration.all.count.to_s.rjust(6,' ')}/#{complete_registrations.count} |  #{registrations_without_users.to_s.rjust(6,' ')}   |   #{registrations_without_accounts.to_s.rjust(6,' ')}   |        --"
    puts '-------------------------------------------------------------------'

  end

end
