namespace :authentication do

  require 'csv'

  desc 'all'
  task :all => [
    'authentication:registrationless_accounts',
    'authentication:accountless_registrations'
  ] do
    puts 'complete.'
  end

  desc 'export registrationless accounts'
  task :registrationless_accounts => :environment do registrationless_accounts('user_accounts_without_registration') end
  desc 'export accountless registrations'
  task :accountless_registrations=> :environment do accountless_registrations('registrations_without_user_accounts') end
  # see authentication_data.rake for an attempt to 'repair' inconsitent authentication data
  #
  desc 'authentication userless accounts without registrations'
  task :userless_accounts_without_registrations=> :environment do userless_accounts_without_registrations('accounts_without_users_and_without_registraton') end

  # those accounts are mostly from 2010 - seems like they have been imported
  def registrationless_accounts(what)
    results = []
    UserAccount.all.each do |account|
      if UserRegistration.find_by(user_account_id: account.id) == nil
        results.push(account)
      end
    end
    write_csv(what, results)
  end

  # those registrations have no account due to their workflow state:
  # states: postponed, rejected, unchecked
  # faulty state: abgelehnt (only one occurrence in zwar)
  def accountless_registrations(what)
    results = []
    UserRegistration.all.each do |reg|
      if UserAccount.find_by(id: reg.user_account_id) == nil
        results.push(reg)
      end
    end
    write_csv(what, results)
  end

  def write_csv(what, results)
    unless results.empty?
      csv_file = Time.now.strftime("#{what}-export-%d.%m.%Y.csv")
      puts "\n#{results.count} Results to write as CSV."

      CSV.open(csv_file, 'w', { col_sep: ";", force_quotes: true }) do |csv|
        keys = results.first.attributes.keys
        csv << keys
        results.each do |r|
            csv << r.attributes.values
        end
      end
      puts "\nDone - exported #{what} to #{csv_file}"
    else
      puts "No #{what} found"
    end
  end
end
