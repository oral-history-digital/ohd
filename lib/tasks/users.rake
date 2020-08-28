namespace :users do

  require 'csv'

  desc 'exports a CSV for newsletter'
  task :newsletter_export => :environment do export_users('wants_newsletter', 'newsletter_recipients') end

  desc 'exports all users'
  task :export_all => :environment do export_users('legit', 'legit_users') end


  def export_users(scope, what)

    csv_file = Time.now.strftime("#{what}-export-%d.%m.%Y.csv")

    registrations = UserRegistration.send(scope)
    puts "\n#{registrations.count} Registrations to write as CSV."

    CSV.open(csv_file, 'w', { col_sep: ";", force_quotes: true }) do |csv|
      #csv << ['Vorname', 'Nachname', 'E-Mail Adresse', 'Beruf', 'Institution', 'Rechercheanliegen', 'Bevorzugte Sprache', 'Workflow State']#, 'Letztes Login', 'Anzahl Logins'] # more fields for testing
      csv << ['Vorname', 'Nachname', 'E-Mail-Adresse', 'Bevorzugte Sprache', 'Datum der Registrierung']

      registrations.each do |r|
          #content = [r.first_name.strip, r.last_name.strip, r.email.strip, u.job_description, (u.organization || '').strip, (u.research_intentions || '').strip, r.default_locale || I18n.default_locale, r.workflow_state ]
          content = [r.first_name.strip, r.last_name.strip, r.email.strip, r.default_locale || I18n.default_locale, r.created_at ]
          # more fields for testing
          if r.user_account
          #  account = UserAccount.find_by id: r.user.user_account_id
          #  content += [account.last_sign_in_at, account.sign_in_count] if account
          end
          csv << content
      end
    end

    puts "\nDone - exported #{what} to #{csv_file}"

  end

  desc "Initialize admins"
  task :init_admins => :environment do

    admins = {
      'jmb@cedis.fu-berlin.de' => %w(Michael Baur),
      'cord.pagenstecher@cedis.fu-berlin.de' => %w(Cord Pagenstecher),
      'chrgregor@googlemail.com' => %w(Christian Gregor),
      'doris.maassen@cedis.fu-berlin.de' => %w(Doris Maassen)
    }

    admins.each do |login, name_parts|
      account = UserAccount.new login: login, email: login
      account.skip_confirmation!
      #next if account.nil?
      reg = account.build_user_registration
      reg.first_name = name_parts[0]
      reg.last_name = name_parts[1]
      reg.email = account.email
      reg.login = account.login
      reg.tos_agreement = true
      reg.priv_agreement = true
      reg.job_description = 'other'
      reg.research_intentions = 'other'
      reg.comments = 'keine Angaben'
      reg.organization = 'CeDiS FU-Berlin'
      reg.homepage = "www.#{Project.first.domain}"
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
      account.save
      puts "created user: #{reg.user.reload}"
    end

  end

end
