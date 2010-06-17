namespace :users do

  desc 'import users from CSV registrations file'
  task :import, [:file] => :environment do |task, args|
    file = args[:file]
    raise 'Please supply a file= argument.' if file.nil?
    raise "No such file '#{file}'." unless File.exists?(file)

    require 'fastercsv'

    FasterCSV.foreach(file, :headers => true, :col_sep => ";") do |row|

      registration = UserRegistration.find_or_initialize_by_email_and_login(row.field("'(E-Mail|Email)'"), row.field("Login"))

      

    end

  end

end