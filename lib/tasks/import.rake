namespace :import do

  namespace :setup do
    desc 'complete setup of a new project'
    task :all => [:environment, 'solr:start', :prepare_new_project, 'solr:delete:all']

    desc 'clean up and prepare the database to start a new archive project'
    task :prepare_new_project => :environment do
      conn = ActiveRecord::Base.connection

      puts 'Start system setup...'

      print 'Are you sure you want to delete all data and set up a new project (type "yes" to confirm)? > '
      raise 'Aborted' if STDIN.gets.chomp != 'yes'

      # Clean the database.
      # TODO: Should user_accounts, user_registrations, users be cleaned up, too?
      %w(
        annotation collection contribution contributor import interview language photo
        registry_reference registry_reference_type registry_entry registry_hierarchy registry_name registry_name_type
        segment tagging tag tape text_material usage_report user_account_ip user_content
      ).each do |entity_to_clean|
        table_name = entity_to_clean.pluralize
        conn.execute "TRUNCATE TABLE #{table_name}"
        translation_table_name = conn.select_value "SHOW TABLES LIKE '#{entity_to_clean}_translations'"
        unless translation_table_name.blank?
          conn.execute "TRUNCATE TABLE #{translation_table_name}"
        end
      end
      puts '...cleaned up the database...'

      puts '...initial setup done.'
    end

  end

  namespace :interviews do

    desc "incremental import of data"
    task :incremental, [:file, :reindex] => :environment do |task,args|
      file = args[:file] || ENV['file']
      reindex = !(args[:reindex] || ENV['reindex']).blank?
      require 'nokogiri'

      raise "No xml file supplied (file=#{file || '...'}). Please provide a valid xml filename." unless File.exists?(file.to_s)

      @parser = Nokogiri::XML::SAX::Parser.new(ArchiveXMLImport.new(file))
      @parser.parse(File.read(file))

      archive_id = (file.split('/').last[Regexp.new("#{Project.project_initials}\\d{3}", Regexp::IGNORECASE)] || '').downcase
      if reindex
        if Interview.find_by_archive_id(archive_id).nil? or not @parser.document.passes_import_sanity_checks
          puts "Interview '#{archive_id}' wasn't imported - skipping indexing!"
        else
          # NOTE: run the reindexing separately to allow for cleanup.
          Rake::Task['solr:reindex:by_archive_id'].execute({ :ids => archive_id })
        end
      end

    end


    desc "limited import from the common repository"
    task :limited, [:number] => :environment do |task, args|
      number = (args[:number] || ENV['number'] || 25).to_i
      files_checked = 0
      imported = 0
      require 'open4'

      repo_dir = Project.archive_management_dir
      @logfile = File.join(Rails.root, 'log', "import.log")
      puts "\nLogging import from #{repo_dir} to #{@logfile}"
      File.open(@logfile,'w+') do |logfile|
        Dir.glob(File.join(repo_dir, "#{Project.project_initials.downcase}**")).each do |dir|
          xmlfile = Dir.glob(File.join(dir, 'data', "#{Project.project_initials.downcase}*.xml")).first
          next if xmlfile.blank? || imported >= number
          archive_id = xmlfile.to_s[Regexp.new("#{Project.project_initials}\\d{3}", Regexp::IGNORECASE)]
          puts "\n[#{number-imported}]\nStarting import processes for archive id: #{archive_id}"
          files_checked += 1

          interview = Interview.find_by_archive_id(archive_id)
          statusmsg = "\n#{archive_id} [#{number-imported}] (#{Time.now.strftime('%d.%m.%y-%H:%M')}):"

          # First: XML import
          Open4::popen4("rake import:interviews:incremental[#{xmlfile}] --trace") do |pid, stdin, stdout, stderr|
            stdout.each_line {|line| puts line }
            errors = []
            stderr.each_line {|line| errors << line unless line.empty? || line =~ /^\*\* (Invoke|Execute)/}
            unless errors.empty?
              errmsg = "\nImport der Interviewdaten (#{xmlfile.to_s[Regexp.new("#{Project.project_initials}\\d{3}", Regexp::IGNORECASE)]} - FEHLER:\n#{errors.join("\n")}"
              puts errmsg
            end
          end

          # Post-processing.
          if interview.nil?
            statusmsg << "skipped #{xmlfile}."
          else
            statusmsg << "import completed for #{archive_id}."
            imported += 1

            # Second: Reindexing of interview
            Rake::Task['solr:reindex:by_archive_id'].execute({:ids => archive_id})

            statusmsg << "imported data from #{interview.imports.last.time}."
          end
          logfile << statusmsg
          puts statusmsg
          logfile.flush
          sleep 2
          puts
        end
      end
      puts "Finished importing #{imported} interviews, #{files_checked} import files processed."
    end


    desc "full import from the common repository"
    task :full => :environment do
      require 'open4'
      repo_dir = Project.archive_management_dir
      @logfile = File.join(Rails.root, 'log', "import_#{Time.now.strftime('%d.%m.%Y.%H-%M')}.log")
      puts "\nLogging import to #{@logfile}"
      File.open(@logfile,'w+') do |logfile|
        Dir.glob(File.join(repo_dir, "#{Project.project_initials.downcase}**")).sort.each do |dir|
          xmlfile = Dir.glob(File.join(dir, 'data', "#{Project.project_initials.downcase}*.xml")).first
          next if xmlfile.blank?
          archive_id = xmlfile.to_s[Regexp.new("#{Project.project_initials}\\d{3}", Regexp::IGNORECASE)]
          puts "\n\nStarting import processes for archive id: #{archive_id}"
          # XML import
          Open4::popen4("rake import:interviews:incremental[#{xmlfile},true] --trace") do |pid, stdin, stdout, stderr|
            stdout.each_line {|line| puts line }
            errors = []
            stderr.each_line {|line| errors << line unless line.empty? || line =~ /^\*\* (Invoke|Execute)/}
            unless errors.empty?
              errmsg = "\nImport der Interviewdaten (#{xmlfile.to_s[Regexp.new("#{Project.project_initials}\\d{3}", Regexp::IGNORECASE)]} - FEHLER:\n#{errors.join("\n")}"
              logfile << errmsg
              puts errmsg
            end
          end
          statusmsg = "finished import of #{xmlfile.to_s[Regexp.new("#{Project.project_initials}\\d{3}", Regexp::IGNORECASE)]}.\n"
          logfile << statusmsg
          puts statusmsg
          puts
        end
      end
    end

  end

end
