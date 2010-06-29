namespace :users do

  desc 'import users from CSV registrations file'
  task :import, [:file] => :environment do |task, args|
    file = args[:file]
    raise 'Please supply a file= argument.' if file.nil?
    raise "No such file '#{file}'." unless File.exists?(file)

    require 'fastercsv'

    FasterCSV.foreach(file, :headers => true, :col_sep => "\t") do |row|

      registration = UserRegistration.find_or_initialize_by_email_and_login(row.field("'(E-Mail|Email)'").to_s.downcase, row.field("Login").to_s.downcase)

      registration.first_name       = row.field("'(Vorname|First name)'")
      registration.last_name        = row.field("'(Nachname|Last name)'")
      registration.tos_agreement    = (row.field("'(Nutzungsbedingungen|Terms of Use)'") =~ /^j/i)
      registration.workflow_state   = row.field("Status")

      # application-info:
      registration.appellation      = row.field("'(Anrede|Title)'")
      registration.job_description  = row.field("'(Beruf|Occupation)'")
      registration.research_intentions  = row.field("'(Recherche-Anliegen|Research objectives)'")
      registration.comments         = row.field("'(Kommentar|Präzisierung des Anliegens|Specification of research objectives)'")
      registration.organization     = row.field("'Institution'")
      registration.homepage         = row.field("'(Homepage der Institution|Institution Homepage)'")
      registration.street           = row.field("'(Strasse|Street Address)'")
      registration.zipcode          = row.field("'(PLZ|ZIP)'")
      registration.city             = row.field("'(Ort|City)'")
      registration.state            = row.field("'(Bundesland|State)'")
      registration.country          = row.field("'(Land|Country)'")

      registration.admin_comments   = row.field("AdminComments")
      registration.processed_at     = row.field("ProcessedAt")

      @created_at = row.field("CreatedAt")

      perform_registration(registration)

    end

  end

  desc 'import users from YML registrations file'
  task :yaml_import, [:file] => :environment do |task, args|
    file = args[:file]
    raise 'Please supply a file= argument.' if file.nil?
    raise "No such file '#{file}'." unless File.exists?(file)

    require 'yaml'

    index = 0

    YAML::load_file(file).each do |record|
      raise "Record is not hashed!" unless record.is_a?(Hash)
      attributes = record.values.first

      index += 1

      registration = UserRegistration.find_or_initialize_by_email_and_login(attributes['email'].to_s.downcase, attributes['username'].to_s.downcase)

      registration.first_name       = attributes['firstname'].to_s
      registration.last_name        = attributes['lastname'].to_s
      registration.tos_agreement    = (attributes['tos_agreement'].to_s.strip == 'Ja')
      registration.workflow_state   = attributes['status'].to_s

      # application-info:
      registration.appellation      = attributes['appellation'].to_s
      registration.job_description  = attributes['job_description'].to_s
      registration.research_intentions  = attributes['research_intentions'].to_s
      registration.comments         = (attributes['comments'].blank? ? 'keine Angaben' : attributes['comments'].to_s)
      registration.organization     = attributes['organization'].to_s
      registration.homepage         = attributes['homepage'].to_s
      registration.street           = attributes['street'].to_s
      registration.zipcode          = attributes['zipcode'].to_s
      registration.city             = attributes['city'].to_s
      registration.state            = attributes['state'].to_s
      registration.country          = attributes['country'].to_s

      registration.admin_comments   = attributes['admin_comments'].to_s

      @created_at = attributes['created_at'].to_s
      registration.processed_at     = attributes['processed_at'].to_s

      perform_registration(registration)

    end

    puts ActionMailer::Base.deliveries.inspect

  end


  desc "import the missing user accounts from the LDAP users.yml"
  task :import_missing, [:file] => :environment do |task,args|
    file = args[:file]
    raise 'Please supply a file= argument.' if file.nil?
    raise "No such file '#{file}'." unless File.exists?(file)

    require 'yaml'

    puts "Reading in accounts that are not in LDAP and not in Registrations:"

    YAML::load_file(file).each do |record|
      raise "Record invalid! #{record.inspect}" unless record.is_a?(Array) and record.last.is_a?(Hash)
      attributes = record.last

      # don't handle accounts that are strictly LDAP
      next if attributes.keys.include?('encrypted_password')

      next unless UserAccount.find_by_login(attributes['login']).nil?

      name = "#{attributes['given_name']} #{attributes['surname']}"

      registration = UserRegistration.find_or_initialize_by_email(attributes['mail'])

      if registration.new_record?
        registration.login = attributes['login']
        registration.first_name       = attributes['given_name'].to_s.strip
        registration.last_name        = attributes['surname'].to_s.strip
        registration.tos_agreement    = true
        registration.workflow_state   = 'registriert'

        # application-info:
        registration.appellation      = ''
        registration.job_description  = 'Mitarbeit'
        registration.research_intentions  = 'Mitarbeit'
        registration.comments         = 'keine Angaben'
        registration.organization     = 'FU-Berlin'
        registration.homepage         = ''
        registration.street           = 'Ihne oder Garystr'
        registration.zipcode          = '14195'
        registration.city             = 'Berlin'
        registration.state            = 'Berlin'
        registration.country          = 'Deutschland'

        registration.admin_comments   = ''
        registration.processed_at     = Time.now

        perform_registration(registration)
      else
        puts "Found existing registration #{registration.id} for User: #{name}"
      end

    end
  end


  def perform_registration(registration)
    new_registration = registration.new_record?

    registration.tos_agreement = true if registration.workflow_state == 'registriert'

    # Save & Skip invalid registrations
    if !registration.valid? || !registration.save
      puts "\nINVALID REGISTRATION: #{registration.inspect}\n#{registration.errors.full_messages}\n"
      return
    end

    post_creation = [ "created_at = '#{@created_at}'" ]

    if registration.workflow_state == 'registriert'

      # find or generate a UserAccount if we have a new record
      if new_registration
        # We have some people that are registered by the E-Mail address they
        # applied with, and some people by their Login. Sad but true.
        account = UserAccount.find_by_login(registration.login)
        account ||= UserAccount.find_or_initialize_by_email(registration.email)
        account.user_registration = registration
        account.login = registration.login if account.login.blank?
        account.email = registration.email if account.email.blank?
        if account.new_record?
          # only save the account for now for FUDIS users:
          if account.email =~ /fu-berlin\.de$/
            # create an account and notify user
            if account.save
              puts "new user account for " + account.login + ' created.'
              account.generate_confirmation_token
              account.save
              puts UserAccountMailer.deliver_reactivate_fudis_account_instructions(account)
              sleep 120
            else
              puts "\nUnsuccessful with account: #{account.inspect}\nErrors: #{account.errors.full_messages}\n"
            end
          else
            # all others will just have their registration saved.
            # change the registration to 'geprüft'
            post_creation << "workflow_state = 'geprüft'"
            puts "non-existant account for non-FU email, setting '#{account.email}' to 'geprüft'."
          end
        else
          post_creation << "user_account_id = #{account.id}"
          puts "associating user account #{account.login} with registration for '#{registration.email}'"
        end
      else
        puts "found existing registration for '#{registration.login}'"
      end
    else
      puts "#{registration.login}: #{registration.workflow_state}"
    end

    unless registration.id.nil?
      UserRegistration.update_all post_creation.join(', '), "id = #{registration.id}"
    end

  end


  desc "converts German workflow_state to English"
  task :convert_workflows => :environment do

    states = { 'ungeprüft' => 'unchecked',
      'geprüft'   => 'checked',
      'registriert' => 'registered',
      'zurückgestellt' => 'postponed',
      'abgewiesen' => 'rejected' }

    states.each_pair do |old_state, new_state|
      number = UserRegistration.update_all "workflow_state = '#{new_state}'", "workflow_state = '#{old_state}'"
      puts "Updated #{number} registrations of state = '#{old_state}' to new state '#{new_state}'"
    end

  end

end