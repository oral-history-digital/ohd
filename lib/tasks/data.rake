namespace :data do

#  desc 'Dumps the data into csv files'
#  task :dump => :environment do
#
#  end

  desc "Setup the initial data for test / demo deployments"
  task :setup => :environment do

    Rake::Task['import:metadata'].execute({ :file => File.join(RAILS_ROOT, 'db', 'import_files', 'interviews.csv')})

    Rake::Task['import:tapes'].execute({ :file => File.join(RAILS_ROOT, 'db', 'import_files', 'tapes.csv')})

    Rake::Task['import:segments'].execute({ :file => File.join(RAILS_ROOT, 'db', 'import_files', 'segments.csv')})

    Rake::Task['import:all_headings'].execute({ :file => File.join(RAILS_ROOT, 'db', 'import_files', 'headings.csv')})

  end

end