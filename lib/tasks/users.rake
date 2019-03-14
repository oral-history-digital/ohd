namespace :users do

  desc 'exports a CSV for newsletter'
  task :newsletter_export => :environment do export_users(['receive_newsletter = ?', true], 'newsletter recipients') end

  desc 'exports all users'
  task :export_all => :environment do export_users(['workflow_state IN (?)', ['checked', 'registered']], 'legit users') end

  def export_users(conditions, what)

    require 'yaml'

    total = UserRegistration.count(:conditions => conditions)
    puts "\n#{total} Registrations to write as CSV."

    csv_file = Time.now.strftime('user-export-%d.%m.%Y.csv')
    FasterCSV.open(csv_file, 'w', {:col_sep => "\t", :force_quotes => true}) do |csv|
      csv << ['Anrede', 'Vorname', 'Nachname', 'E-Mail Adresse', 'Beruf', 'Institution', 'Rechercheanliegen', 'Bundesland', 'Bevorzugte Sprache']

      UserRegistration.find_each(:conditions => conditions, :include => :user) do |r|
        appellation = YAML::load(r.application_info)[:appellation]
        u = r.user || User.new
        csv << [ appellation, r.first_name.strip, r.last_name.strip, r.email.strip, u.job_description, (u.organization || '').strip, (u.research_intentions || '').strip, u.state, r.default_locale || I18n.default_locale ]
      end
    end

    puts "\nDone - exported #{what} to #{csv_file}"

  end

  desc "Initialize admins"
  task :init_admins => :environment do

    admins = { 
      'jmb@cedis.fu-berlin.de' => %w(Herr Michael Baur),
      'rico.simke@cedis.fu-berlin.de' => %w(Herr Rico Simke),
      'chrgregor@googlemail.com' => %w(Herr Christian Gregor)
    }

    admins.each do |login, name_parts|
      account = UserAccount.create login: login, email: login
      #next if account.nil?
      reg = account.build_user_registration
      reg.appellation = name_parts[0]
      reg.first_name = name_parts[1]
      reg.last_name = name_parts[2]
      reg.email = account.email
      reg.login = account.login
      reg.tos_agreement = true
      reg.priv_agreement = true
      reg.job_description = 'Projektmitarbeiter'
      reg.research_intentions = 'Projektmitarbeit'
      reg.comments = 'keine Angaben'
      reg.organization = 'CeDiS FU-Berlin'
      reg.homepage = "www.#{Project.project_domain}"
      reg.street = 'Ihnestr. 24'
      reg.zipcode = '14195'
      reg.city = 'Berlin'
      reg.state = 'Berlin'
      reg.country = 'Deutschland'
      reg.default_locale = 'de'
      reg.save
      reg.register!
      User.where(id: reg.user.id).update_all admin: true
      account.password = account.password_confirmation = "bla4bla"
      account.confirmed_at = DateTime.now
      account.skip_confirmation!
      account.save
      puts "created user: #{reg.user.reload}"
    end

  end

end
