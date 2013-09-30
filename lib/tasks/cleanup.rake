namespace :cleanup do

  desc "test requiring plugins"
  task :test => :environment do

    require 'authorization'
    puts "Authorization plugin present!"

  end

  desc "cleans up UserRegistration#created_at"
  task :user_creation_dates => :environment do
    puts "Cleaning up problematic creation dates for UserRegistration:"
    ids = UserRegistration.find(:all, :conditions => ["created_at = ?", '0000-00-00 00:00:00']).map(&:id)
    updated = UserRegistration.update_all "created_at = '#{Time.gm(2010,1,1).to_s(:db)}'", "id IN (#{ids.join(',')})"
    puts "#{updated} registrations updated."
  end

  desc "make photo filenames consistent with existing resources"
  task :photos => :environment do

    offset = 0
    batch = 25
    total = Photo.count :all

    puts "Checking and cleaning photo resource paths for #{total} photos:"

    while offset < total

      Photo.find(:all, :limit => "#{offset},#{batch}").each do |photo|

        if !File.exists?(photo.photo.path)

          file = Dir.glob(photo.photo.path.sub(/\w{3}$/,'{jpg,JPG,png,PNG}')).first

          if file.nil?
            puts "No matching files found for photo #{photo.id}: #{photo.photo.path.split('/').last}"
            next
          end

          previous_filename = photo.photo_file_name
          new_filename = previous_filename.sub(/\w{3}$/, file.split('/').last[/\w{3}$/])

          # save this as photo file name
          photo.update_attribute :photo_file_name, new_filename

          puts "Changed photo #{photo.id} filename from '#{previous_filename}' to '#{new_filename}'"

        end

      end

      offset += batch

    end

    puts "done."

  end


  desc "Reassigns section numbers for all segments of an interview"
  task :segment_sections, [:id] => :environment do |task,args|

    archive_id = (args[:id] || '')[/za\d{3}/]

    conditions = "researched = true"
    unless archive_id.nil?
      puts "\nChecking section numbers for #{Interview.count(:all, :conditions => "researched = true")} interviews."
      conditions << " AND archive_id = #{archive_id.downcase}"
    end

    Interview.find_each(:conditions => conditions) do |interview|

      puts "\nUpdating section numbers for #{interview.archive_id} '#{interview}' (#{interview.segments.size} segments):"

      section = 0
      subsection = 0

      interview.segments.each_with_index do |segment,index|
        if !segment.mainheading.blank?
          section += 1
          subsection = 0
        end
        if !segment.subheading.blank?
          subsection += 1
        end
        section_str = "#{section}"
        section_str << ".#{subsection}" unless subsection == 0
        Segment.update_all "section = '#{section_str}'", "id = #{segment.id}" unless segment.section == section_str
        if index % 75 == 0
          STDOUT.printf '.'
          STDOUT.flush
        end
      end

    end

    puts "\ndone."
  end


  desc "cleanup segment ordering and tape assignment"
  task :segments => :environment do

    # 1. Upcase Media-IDS
    # Make sure the media id's are in the correct format first
    puts "\nUpcasing media_ids:"
    # upcase media_ids
    upcased = 0
    Segment.find(:all, :conditions => "media_id REGEXP 'za'").each do |segment|
      segment.update_attribute :media_id, segment.media_id.upcase
      upcased += 1
    end
    puts "Upcased #{upcased} segment media_ids. done.\n"


    # 2. Match with correct tapes
    # Make sure the segments match the tape according to media_id
    joins = "LEFT JOIN tapes ON tapes.id = segments.tape_id"
    conditions = "NOT( segments.media_id REGEXP tapes.media_id)"
    total = Segment.count(:all, :joins => joins, :conditions => conditions)
    puts "\nAttaching to the correct tape media_id: #{total} segments"
    tape = nil
    tape_ids_updated = 0

    Segment.find(:all, :joins => joins, :conditions => conditions, :readonly => false).each do |segment|
      tape_media_id = segment.media_id[/^za\d{3}_\d{2}_\d{2}/i].upcase
      unless tape.is_a?(Tape) && tape.media_id == tape_media_id
        tape = Tape.find_by_media_id tape_media_id
      end
      if tape.nil?
        puts "No tape found for #{tape_media_id} (#{segment.media_id})"
      else
        raise "Couldn't update #{segment.media_id}!" unless segment.update_attribute :tape_id, tape.id
        tape_ids_updated += 1
      end
      if tape_ids_updated % 50 == 1
        STDOUT.printf '.'
        STDOUT.flush
      end
    end
    puts "\nUpdated #{tape_ids_updated} segments. done.\n"


    # 3. Correct segment ordering
    # Reorder all segments for tapes that have segments with duration null
    conditions = "segments.duration IS NULL"
    group = "tapes.id"

    missing_tapes = []
    reordered_tapes = []

    total = Segment.count(:all, :joins => joins, :conditions => conditions, :group => group).size

    puts "\nCorrecting #{total} tapes for missing durations and segment media_id/timecode mismatch:"

    Segment.find(:all, :joins => joins, :conditions => conditions, :group => "tapes.id").each do |segment|

      tape_media_id = segment.media_id[/^za\d{3}_\d{2}_\d{2}/i].upcase

      if segment.tape.nil?
        puts "No tape #{tape_media_id} found for Segment: #{segment.inspect}"
        missing_tapes << tape_media_id
        next

      else
        unless reordered_tapes.include?(tape_media_id)
          tape = segment.tape
          batch = 25
          offset = 0
          total = tape.segments.size

          while offset < total
            Segment.find(:all, :conditions => ['tape_id = ?', tape.id], :order => 'timecode ASC', :limit => "#{offset},#{batch}").each do |s|
              offset += 1
              s.update_attribute :media_id, (tape.media_id + "_#{offset.to_s.rjust(4,'0')}")
            end
            STDOUT.printf '.'
            STDOUT.flush
          end

          reordered_tapes << tape_media_id
        end


      end

    end

    puts "\nReordered #{reordered_tapes.size} tapes."

    puts "\n#{missing_tapes.uniq.size} missing tape media id's:"
    # now for the missing tapes:
    missing_tapes.uniq.each do |tape_media_id|
      puts "Missing tape: #{tape_media_id}"
    end

    # Add an empty translation field for segments of interviews
    # with a translation that have an empty translation

    puts "\nAdding empty translations to segments missing a translation..."

    next_untranslated_segments = lambda do
      Segment.find(:all,
                            :limit => "0,25",
                            :joins => "RIGHT JOIN tapes ON segments.tape_id = tapes.id RIGHT JOIN interviews ON interviews.id = tapes.interview_id",
                            :conditions => "interviews.translated = ? AND segments.translation IS NULL")
    end

    segments = next_untranslated_segments.call
    segments_updated = 0

    while (!segments.empty?)
      STDOUT.printf '.'
      STDOUT.flush
      segments_updated += Segment.update_all "translation = '(...)'", "id IN ('#{segments.map(&:id).join("','")}')"
      segments = next_untranslated_segments.call
    end

    puts "\n#{segments_updated} segments updated."

    puts "\ndone."

    puts "\nNow you should run 'rake data:segment_duration' again."

  end


  desc "Removes headings from interview segments"
  task :remove_headings, [:id, :ids] => :environment do |task, args|
    ids = args[:id] || args[:ids]
    if ids.blank?
      joins = ''
      conditions = ''
    else
      joins = 'RIGHT JOIN tapes ON segments.tape_id = tapes.id RIGHT JOIN interviews ON interviews.id = tapes.interview_id'
      conditions = "interviews.archive_id IN ('#{ids.split(/\W/).join("','")}') AND "
    end

    conditions << "(segments.mainheading IS NOT NULL OR segments.subheading IS NOT NULL)"

    offset = 0
    batch = 100
    total = Segment.count(:all, :joins => joins, :conditions => conditions)

    removed_headings = []

    puts "Removing headings from #{total} segments:"

    while offset < total

      Segment.find(:all, :joins => joins, :conditions => conditions, :limit => "0,#{batch}", :readonly => false).each do |segment|
        if segment.update_attributes({ :mainheading => nil, :subheading => nil })
          archive_id = segment.media_id[/^\w{2}\d{3}/].downcase
          removed_headings << archive_id unless removed_headings.include?(archive_id)
        end
      end

      STDOUT.printf '.'
      STDOUT.flush

      offset += batch
    end

    puts "\nRemoved headings from:\n#{removed_headings.uniq.sort.join('\n')}\n"

    puts "done."

  end


  desc "cleans up registrations that have been botched by malformed emails"
  task :registrations => :environment do

    puts "\nChecking user registrations for malformed emails and missing accounts..."

    registration = UserRegistration.find(:all, :conditions => "workflow_state = 'checked'").select{|ur| (ur.email =~ Devise::EMAIL_REGEX).nil?}.first

    while !registration.nil?
      if registration.email =~ /\s+/
        registration.email = registration.email.gsub(' ','')
        registration.send(:create_account)
        registration.send(:initialize_user)
        registration.save
        mail = UserAccountMailer.deliver_account_activation_instructions(registration, registration.user_account)
        unless mail.nil?
          puts "\nSent Mail to: '#{registration.email}':\n#{mail.body}"
        else
          puts "\nCould not send mail to: '#{registration.email}' (UserRegistration ##{registration.id})"
        end
      else
        puts "\nCannot find problem with email: '#{registration.email}' for user_registration ##{registration.id}"
      end
      puts

      registration = UserRegistration.find(:all, :conditions => "workflow_state = 'checked' AND activated_at IS NULL").select{|ur| (ur.email =~ Devise::EMAIL_REGEX).nil?}.first
    end


    puts "\n\nChecking for more than one user registration per account...\n"

    UserRegistration.find(:all, :having => "count(user_account_id) > 1", :group => 'user_account_id').each do |registration|
      multiples = UserRegistration.find(:all, :conditions => ['user_account_id = ?', registration.user_account_id])
      number = multiples.size
      removables = multiples.select{|reg| reg != reg.user_account.user_registration }
      if removables.size == number
        removables.delete(removables.max{|a,b| a.attributes.to_s.length <=> b.attributes.to_s.length })
      end
      keepers = (multiples - removables).first
      puts "Keeping: #{keepers.inspect}"
      removables.each do |item|
        if item.email != keepers.email
          puts "Keeping also: #{item.inspect}"
        else
          item.destroy
          puts "Deleted: #{item.inspect}"
        end
      end
    end


    puts "\n\nChecking registered user registrations that are stuck in 'checked' state to activate..."

    registrations = UserRegistration.find(:all, :conditions => "workflow_state = 'checked' AND activated_at IS NULL", :limit => "0,150")
    last_size = 0

    while !registrations.empty? && registrations.size == 150 && registrations.size != last_size
      last_size = registrations.size
      registrations.each do |registration|
        account = registration.user_account
        next if account.blank? || account.encrypted_password.blank? || account.password_salt.blank? || account.confirmed_at.blank?
        begin
          account.user_registration.activate!
          puts "Activated '#{account.login}'."
        rescue Exception => e
          puts "\nERROR: #{e.message}\nREGISTRATION: #{registration.inspect}\n"
          puts e.backtrace unless !e.respond_to?(:backtrace) || e.backtrace.nil?
          exit
        end
      end
      registrations = UserRegistration.find(:all, :conditions => "workflow_state = 'checked' AND activated_at IS NULL", :limit => "0,150")
    end


  end


  desc "Parses a logfile and sets newsletter settings according to the registration info sent"
  task :parse_log_for_newsletter, [:file] => :environment do |task,args|

    file = args[:file]
    raise "No logfile supplied (file=), aborting." unless File.exists?(file)

    puts "Extracting newsletter recipients from logfile..."

    email_extraction = /(email"=>")([^"]*)(",)/

    newsletter_recipients = []

    lines = 0
    File.open(file, 'r').each do |line|
      lines += 1
      if lines % 1001 == 0
        STDOUT.printf '.'; STDOUT.flush
      end
      next unless line =~ /send_newsletter"=>"1/
      email = line.scan(email_extraction)
      unless email.empty?
        address = email.first[1]
        STDOUT.printf '!'; STDOUT.flush
        newsletter_recipients << address
      end
    end

    newsletter_recipients.uniq!

    puts "\ndone. #{lines} lines scanned, #{newsletter_recipients.size} newsletter recipients found."

    puts "\nAdjusting Flag in Database for #{newsletter_recipients.size} potential users."

    mailgroup = []
    num_group = 0
    newsletter_recipients.each_with_index do |email,index|
      mailgroup << email
      if index % 20 == 1
        updates = UserRegistration.update_all 'receive_newsletter = 1', "email IN ('#{mailgroup.join("','")}')"
        num_group += 1
        puts "#{num_group}. group: #{updates} registrations of #{mailgroup.size} records updated."
        mailgroup = []
      end
    end
    updates = UserRegistration.update_all 'receive_newsletter = 1', "email IN ('#{mailgroup.join("','")}')"
    num_group += 1
    puts "#{num_group}. group: #{updates} registrations of #{mailgroup.size} records updated."

    puts "\ndone."

  end


  desc "Marks interviews as segmented, proofread or researched"
  task :update_workstate => :environment do

    puts "\nChecking interviews for updates to the workflow flags"
    updated = 0
    checked = 0
    Interview.find_each(:conditions => ["segmented = ? AND proofread = ? AND researched = ?", false, false, false]) do |interview|
      interview.send('set_workflow_flags')
      checked += 1
      if interview.changed?
        interview.save
        updated += 1
      end
      if checked % 5 == 1
        STDOUT.printf '.'
        STDOUT.flush
      end
    end

    puts "\nDone. Updated #{updated} out of #{checked} interviews."

  end


  desc "Fixes interviews with any other number than 1 country category"
  task :fix_countries => :environment do

    interviews = begin
      Interview.find(:all).select{|i| i.countries.size != 1}
    end

    puts "#{interviews.size} interviews with wrong number of countries. Starting to fix"

    interviews.each do |interview|
      interview.categorizations.select{|c| c.category_type == 'Lebensmittelpunkt'}.each{|c| c.destroy }
      interview.send('set_country_category')
      STDOUT.printf '.'
      STDOUT.flush
    end

    puts "\n\nRe-mapping non-standardized country names"
    countries = Category.find(:all, :conditions => "category_type = 'Lebensmittelpunkt'")
    mapping_table = {}
    countries.each do |country|
      t_name = I18n.translate(country.name, :scope => 'location.countries', :locale => :de)
      unless t_name == country.name
        standardized_country = countries.select{|c| c.name == t_name }.first
        unless standardized_country.nil?
          mapping_table[country.id] = standardized_country.id
        end
      end
      STDOUT.printf '.'
      STDOUT.flush
    end
    updated = 0
    mapping_table.each_pair do |from, to|
      updated += Categorization.update_all "category_id = #{to}", "category_id = #{from} AND category_type = 'Lebensmittelpunkt'"
    end
    puts "\n#{updated} categorizations re-mapped (for #{mapping_table.keys.size} countries total)."

    puts "\nReindexing these interviews:"
    Rake::Task['solr:reindex:interview_data'].execute({:ids => interviews.map(&:archive_id).join(",")})

    puts "\nDeleting all unnecessary country categories"
    cats = Category.find(:all, :joins => "LEFT JOIN categorizations AS cz ON cz.category_id = categories.id", :conditions => "categories.category_type = 'Lebensmittelpunkt' AND cz.id IS NULL")
    puts "#{cats.size} countries found"
    cats.each{|c| puts c.name; c.destroy }

    puts "\nDone."

  end


  desc "Fixes problems with the languages"
  task :languages => :environment do

    interviews = []

    # Identify all categories that contain a slash
    Category.find_each(:conditions => "name REGEXP '/' AND category_type = 'Sprache'") do |category|
      puts "\n" + category.name + ':'
      languages = category.name.split('/').map{|l| l.strip }
      category.interviews.each do |interview|
        interviews << interview
        puts interview.archive_id + ': ' + interview.languages.size.to_s + ' Sprachen'
        interview.categorizations.select{|c| c.category_id == category.id }.each{|cc| cc.destroy }
        languages.each do |language_name|
          language = Category.find_or_initialize_by_name_and_category_type(language_name, 'Sprache')
          language.save if language.new_record?
          interview.languages << language unless interview.languages.include?(language)
        end
        interview.save
      end
      puts
    end

    puts "#{interviews.size} interviews changed. Reindexing:"
    Rake::Task['solr:reindex:interview_data'].execute({:ids => interviews.map(&:archive_id).join(",")})

  end


  desc "Fixes forced labor groups - duplicates"
  task :forced_labor_groups => :environment do

    group_names = Category.find(:all, :select => "name", :conditions => "category_type = 'Gruppen'", :group => 'name').map(&:name)

    valid_group_names = group_names.map{|g| I18n.t(g, :scope => 'categories.forced_labor_groups', :locale => :de)}.uniq.delete_if{|g| !g[/^de\./].blank?}

    invalid_group_names = group_names - valid_group_names

    invalid_to_valid = {}

    invalid_group_names.each do |group|
      valid = I18n.t(group, :scope => 'categories.forced_labor_groups', :locale => :de)
      valid = nil unless valid_group_names.include?(valid)
      invalid_to_valid[group] = valid
    end

    puts "\nFound #{group_names.size} group names, #{valid_group_names.size} are valid."

    interviews = []

    puts "\nInvalid group names:\n" unless invalid_group_names.empty?

    invalid_group_names.each do |group|
      puts group.to_s + ':'
      category = Category.find_by_name_and_category_type(group, 'Gruppen')
      valid_id = if invalid_to_valid[group].nil?
        nil
      else
        Category.find_by_name_and_category_type(invalid_to_valid[group],'Gruppen').id
      end
      interviews << Categorization.find(:all, :conditions => "category_id = #{category.id}").map(&:interview_id)
      if valid_id
        Categorization.update_all "category_id = #{valid_id}", "category_id = #{category.id}"
        puts " - mapping all categorizations for '#{group}' (#{category.id}) to '#{invalid_to_valid[group]}' (#{valid_id})"
      else
        Categorization.delete_all "category_id = #{category.id}"
        puts " - deleting all categorizations for '#{group}' (#{category.id})"
      end
      puts " - delete '#{group}' (#{category.id}) later by running 'cleanup:unused_categories' if you know what you're doing.\n"
      puts
    end

    # Find and remove duplicate categorizations
    puts "\nChecking for duplicate category associations"
    Categorization.find(:all, :conditions => "category_type = 'Gruppen'", :group => "interview_id", :having => "COUNT(*) > COUNT(category_id)").map(&:interview_id).each do |interview_id|
      interview = Interview.find interview_id
      next if interview.nil?
      puts interview.archive_id
      groups = []
      interview.forced_labor_groups.each do |group|
        if groups.include?(group.id)
          group.destroy
          puts " - one instance of '#{group.name}' removed."
        end
        groups << group.id
      end
    end

    interviews = interviews.flatten.uniq
    unless interviews.empty?
      puts "#{interviews.size} interviews to reindex:"
      archive_ids = Interview.find(:all, :select => "archive_id", :conditions => "id IN (#{interviews.join(",")})").map(&:archive_id)
      Rake::Task['solr:reindex:by_archive_id'].execute({:ids => archive_ids.join(",")})
    end

    puts "Done."

  end


  # WARNING: unused categories could still be in the index
  # MAKE SURE YOU HAVE AN UP-TO-DATE INDEX BEFORE RUNNING THIS
  desc "Removes unused categories - those that aren't used by any interviews"
  task :unused_categories => :environment do

    puts "Checking for unused categories:"

    cats = Category.find(:all, :joins => "LEFT JOIN categorizations AS cz ON cz.category_id = categories.id", :conditions => "cz.id IS NULL")
    puts "#{cats.size} unused categories found#{cats.size > 0 ? ' - deleting.' : ''}"
    cats.each do |category|
      puts "#{category.category_type}: #{category.name} deleted."
      category.destroy
    end

    puts "Done."
    
  end


  desc "Removes duplicate categorizations - two or more assignments to exactly the same category for an interview"
  task :remove_duplicate_categories => :environment do

    puts "Checking duplicates for #{Category.count(:all)} categories:"

    Category.find_each do |category|

      duplicate_categorizations = Categorization.find(:all, :conditions => "category_id = #{category.id}", :group => "interview_id", :having => "count(interview_id) > 1")

      duplicate_categorizations.each do |categorization|
        removed = Categorization.delete_all "interview_id = #{categorization.interview_id} AND category_id = #{categorization.category_id} AND id != #{categorization.id}"
        if removed > 0
          puts "\n - deleted #{removed} duplicate categorization(s) for interview #{categorization.interview_id} '#{category.name}' (#{category.category_type})"
        end
      end

      STDOUT.printf '.'
      STDOUT.flush

    end

    puts "Done."

  end


  desc "Removes empty location references"
  task :remove_empty_locations => :environment do

    empty_locs = LocationReference.find :all, :conditions => "name REGEXP '^.{1,2}$'"

    puts "\nChecking #{empty_locs.size} location_references for empty descriptors."
    deleted = 0

    empty_locs.each do |loc|
      if loc.name.scan(/[a-z0-9]/).empty?
        loc.destroy
        deleted += 1
      end
      STDOUT.printf '.'
      STDOUT.flush
    end

    puts "\n#{deleted} location_references deleted."

  end


  desc "Fixes import times after the migration to created_at but before they were imported correctly"
  task :import_times => :environment do

    puts "Fixing import times: (setting to 01.12.2012)"
    count = 0
    Import.find_each(:conditions => ["created_at IS NULL OR created_at < ?", Time.gm(2013, 03, 19).to_s(:db)]) do |import|
      if import.created_at.nil? || ((import.created_at - 3.minutes) < import.time)
        next if import.id != import.importable.imports.last.id
        @created_at = import.created_at || import.time
        @time = Time.gm(2012,12,1)
        @time = (@created_at - 5.minutes) if @created_at < @time
        @created_at = Time.gm(2012,11,18) if @created_at < Time.gm(2012,11,18)
        Import.update_all "created_at = '#{@created_at.to_s(:db)}', time = '#{@time.to_s(:db)}'", "id = #{import.id}"
        puts "updated import for #{import.importable} from '#{@created_at}'."
        count +=1
      end
    end
    puts "\nDone. Updated #{count} import records."

  end


  desc "Fixes user_registrations that are by all means registered, but don't have that workflow state"
  task :registered_users => :environment do

    puts "Attempting to fix user_registrations that are missing the 'registered' workflow state:"

    conditions = "workflow_state = 'checked' AND activated_at IS NOT NULL"

    updated = 0
    mismatched = 0

    UserRegistration.find_each(:conditions => conditions) do |registration|
      next if registration.user_account.confirmed_at.nil? || registration.user_account.encrypted_password.nil?
      if registration.user_account.deactivated_at.nil?
        if (registration.activated_at - registration.user_account.confirmed_at) < 1.minute
          puts "Updating '#{registration.user_account.login}/#{registration.email}', confirmed at: #{registration.user_account.confirmed_at.strftime('%d.%m.%Y %H:%M')}"
          updated += UserRegistration.update_all "workflow_state = 'registered'", "id = #{registration.id}"
        else
          puts "Confirmation/Activation mismatch for '#{registration.user_account.login}/#{registration.email}': conf=#{registration.user_account.confirmed_at}, act=#{registration.activated_at}"
          mismatched += 1
        end
      else
        puts "Deactivated account skipped: #{registration.user_account.login}"
      end
    end

    puts "Done. Updated #{updated} registrations. #{mismatched} registrations showed mismatch."

  end

end