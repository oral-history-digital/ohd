namespace :import do

  desc 'all'
  task :all => [
    'import:tapes',
    'import:languages',
    'import:registry_references',
    'import:contributions'
  ] do
    puts 'complete.'
  end

  task tapes: :environment do
    #file_path = "/data/applications/zwar_archive/current/tapes.csv"
    #file_path = "../unpublished_exported_from_zwar_platform/tapes.csv"
    file_path = "za026-tapes.csv"
    csv = Roo::CSV.new(file_path, csv_options: { col_sep: ";", row_sep: :auto, quote_char: "\x00", force_quotes: true })
    csv.each_with_index do |data, index|
      begin
        interview = Interview.find_by_archive_id(data[0])
        # [interview.archive_id, tape.media_id, tape.duration, tape.filename, tape.workflow_state, tape.indexed_at]
        Tape.create interview_id: interview.id, media_id: data[1], duration: data[2], filename: data[3], workflow_state: data[4]
      rescue StandardError => e
        puts ("#{e.message}: #{e.backtrace}")
      end
    end
  end

  task languages: :environment do
    #file_path = "/data/applications/zwar_archive/current/languages.csv"
    file_path = "../unpublished_exported_from_zwar_platform/languages.csv"
    #file_path = "za026-language.csv"
    csv = Roo::CSV.new(file_path, csv_options: { col_sep: ";", row_sep: :auto, quote_char: "\x00", force_quotes: true })
    csv.each_with_index do |data, index|
      begin
        language = Language.find_by_code(data[1]) 
        interview = Interview.find_by_archive_id(data[0])
        interview.update language_id: language.id
      rescue StandardError => e
        puts "#{data[0]}: #{data[1]}"
        puts ("#{e.message}: #{e.backtrace}")
      end
    end
  end

  task registry_references: :environment do
    #file_path = "/data/applications/zwar_archive/current/registry_references.csv"
    file_path = "../unpublished_exported_from_zwar_platform/registry_references.csv"
    #file_path = "za026-registry_references.csv"
    csv = Roo::CSV.new(file_path, csv_options: { col_sep: ";", row_sep: :auto, quote_char: "\x00", force_quotes: true })
    csv.each_with_index do |data, index|
      begin
        unless data[1] == 'Segment'
          # za026;Person;26;forced_labor_location;28400
          interview = Interview.find_by_archive_id(data[0])
          registry_reference_type = data[3] && RegistryReferenceType.find_by_code(data[3])
          if interview && data[1] == 'Person'

            registry_entry = nil
            if data[5]
              data[5].gsub("\"", '').split('#').each do |name_w_locale| 
                locale, names = name_w_locale.split('::')
                names = names.split(';')
                names.each do |name|
                  registry_entry = RegistryEntry.joins(registry_names: :translations).where("registry_name_translations.descriptor": name).first unless registry_entry
                end
              end
            end
            registry_entry_id = registry_entry && registry_entry.id
            puts "*** registry_entry #{data[4]} #{registry_entry ? '' : 'NOT'} found by name"

            unless registry_entry 
              registry_entry = RegistryEntry.find_by_id(data[4])
              puts "*** registry_entry #{data[4]} #{registry_entry ? '' : 'NOT'} found by id"

              if registry_entry
                registry_entry_names = registry_entry.registry_names.map{|rn| rn.translations.map{|t| t.descriptor.split(';')}}.flatten
                found = false
                if data[5]
                  data[5].gsub("\"", '').split('#').each do |name_w_locale| 
                    locale, names = name_w_locale.split('::')
                    names = names.split(';')
                    names.each do |name|
                      found = true if registry_entry_names.include?(name) 
                    end
                  end
                end
                registry_entry_id = data[4] if found #data_name_de && name_de =~ Regexp.new(Regexp.escape(data_name_de))

                puts "*** registry_entry names: #{registry_entry_names}"
                puts "*** data: #{data[5]}"
                puts "*** #{registry_entry_id ? 'match' : 'no match'}"
              else
                # check if parent exists
                parent = RegistryEntry.find_by_id(data[6])
                if parent 
                  parent_names = parent.registry_names.map{|rn| rn.translations.map{|t| [t.locale, t.descriptor].join('::')}}.join(';')
                  if parent_names == data[7].gsub("\"", '')
                    registry_entry_id = RegistryEntry.create_with_parent_and_names(parent.id, data[5].gsub("\"", '')).id
                    puts "*** registry_entry #{registry_entry_id} with parent created"
                  else
                    puts "*** registry_entry #{data[4]} with parent #{data[6]} not found and not created"
                    puts "TO CREATE: #{data[4]}, #{data[6]}"
                  end
                elsif data[6].nil?
                  registry_entry_id = RegistryEntry.create_with_parent_and_names(nil, data[5].gsub("\"", '') || []).id
                  puts "*** registry_entry #{registry_entry_id} without parent created"
                end
              end
            end

            if registry_entry_id
              RegistryReference.create(
                interview_id: interview.id,
                ref_object_id: interview.id,
                ref_object_type: 'Interview',
                ref_position: 0,
                workflow_state: 'preliminary',
                registry_reference_type_id: registry_reference_type && registry_reference_type.id,
                registry_entry_id: registry_entry_id
              )
              puts "*** registry_entry #{registry_entry_id} referenced"
            else
              puts "*** registry_entry #{data[4]} NOT referenced"
            end
            puts "*************************************************"
          else
            puts "interview #{data[0]} not found"
          end
        end
      rescue StandardError => e
        puts ("#{e.message}: #{e.backtrace}")
      end
    end
  end

  task registry_entries: :environment do
    file_path = "../unpublished_exported_from_zwar_platform/registry_entries.csv"
    csv = Roo::CSV.new(file_path, csv_options: { col_sep: ";", row_sep: :auto, quote_char: "\x00", force_quotes: true })
    csv.each_with_index do |data, index|
      begin
        # check if parent exists
        parent = RegistryEntry.find_by_id(data[2])
        if parent 
          parent_names = parent.registry_names.map{|rn| rn.translations.map{|t| [t.locale, t.descriptor].join('-')}}.join(',')
          if parent_names == data[3]
            registry_entry_id = RegistryEntry.create_with_parent_and_names(parent.id, data[1]).id
            puts "*** registry_entry #{registry_entry_id} with parent created"
          else
            puts "*** registry_entry #{data[0]} with parent #{data[2]} not found and not created"
            puts "TO CREATE: #{data[0]}, #{data[2]}"
          end
        elsif data[2].nil?
          registry_entry_id = RegistryEntry.create_with_parent_and_names(nil, data[1] || []).id
          puts "*** registry_entry #{registry_entry_id} without parent created"
        end
      rescue StandardError => e
        puts ("#{e.message}: #{e.backtrace}")
      end
    end
  end

  task contributions: :environment do
    #file_path = "../unpublished_exported_from_zwar_platform/contributions.csv"
    file_path = "za026-contributions.csv"
    csv = Roo::CSV.new(file_path, csv_options: { col_sep: ";", row_sep: :auto, quote_char: "\x00", force_quotes: true })
    csv.each_with_index do |data, index|
      begin
        unless data[0].blank? 

          # en
          I18n.locale = :en 
          person = Person.find_or_create_by(first_name: data[2], last_name: data[3])
          history = person.histories.first || History.create(person_id: person.id)
          history.update(
            return_date: data[20],
            forced_labor_details: data[21],
          )
          person.update(
            birth_name: data[19],
            other_first_names: data[22] # middle_names
          )

          # de
          I18n.locale = :de 
          person.update(first_name: data[0], last_name: data[1])
          history.update(
            return_date: data[16],
            forced_labor_details: data[17],
          )
          person.update(
            birth_name: data[15],
            other_first_names: data[18] # middle_names
          )

          # ru
          I18n.locale = :ru 
          person.update(first_name: data[4], last_name: data[5])
          history.update(
            return_date: data[24],
            forced_labor_details: data[25],
          )
          person.update(
            birth_name: data[23],
            other_first_names: data[26] # middle_names
          )

          # untranslated
          person.update(
            gender: data[7],
            alias_names: data[8],
            date_of_birth: data[9],
          )

          history.update(
            deportation_date: data[10],
            #forced_labor_industry: data[11],
            #forced_labor_habitation_details: data[12],
            punishment: data[13],
            liberation_date: data[14]
          )

          contributions = data[6] && data[6].split(',')
          contributions.each do |contribution|
            archive_id, contribution_type = contribution.split('-')
            interview = Interview.find_by_archive_id(archive_id)
            if interview
              Contribution.find_or_create_by(
                person_id: person.id,
                interview_id: interview.id,
                contribution_type: contribution_type
              )
            else
              puts "interview #{archive_id} not found"
            end
          end
        end
      rescue StandardError => e
        log("#{e.message}: #{e.backtrace}")
      end
    end
  end

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

      puts file

      reindex = !(args[:reindex] || ENV['reindex']).blank?
      require 'nokogiri'
      #
      raise "No xml file supplied (file=#{file || '...'}). Please provide a valid xml filename." unless File.exists?(file.to_s)
      #
      @parser = Nokogiri::XML::SAX::Parser.new(ArchiveXMLImport.new(file))

      read_file = File.read(file)

      @parser.parse(read_file)
      #
      archive_id = (file.split('/').last[Regexp.new("#{Project.project_initials}\\d{3}", Regexp::IGNORECASE)] || '').downcase
      if reindex
        if Interview.find_by_archive_id(archive_id).nil? or not @parser.document.passes_import_sanity_checks
          puts "Interview '#{archive_id}' wasn't imported - skipping indexing!"
        else
          # NOTE: run the reindexing separately to allow for cleanup.
          Rake::Task['solr:reindex:by_archive_id'].execute({:ids => archive_id})
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
          # # XML import
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
