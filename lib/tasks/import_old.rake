namespace :import_old do

  desc "Import der Teilsammlungen"
  task :collections, [ :file ] => :environment do |task, args|
    csv_file = args[:file] || ENV['file']
    raise "no csv file provided (as argument or 'file' environment variable), aborting." if csv_file.nil?
    puts "csv file = #{csv_file}"
    require 'fastercsv'

    FasterCSV.foreach(csv_file, :headers => true, :col_sep => "\t") do |row|

      collection = Collection.find_by_name row.field('name')
      collection ||= Collection.create :name => row.field('name')

      if collection
        collection.update_attributes :countries => row.field("countries"),
                                     :institution => row.field("institution"),
                                     :responsibles => row.field("responsibles"),
                                     :notes => row.field("notes"),
                                     :interviewers => row.field("interviewers")
        puts "Teilsammung #{collection.name} aktualisiert."
      else
        puts "Teilsammlung #{row.field('name')} nicht gefunden!"


      end

    end

  end

  desc "Import der Interviewdaten"
  task :interviews, [ :file ] => :environment do |task, args|
    puts "ARGUMENTS: #{args.inspect}"
    csv_file = args[:file] || ENV['file']
    raise "no csv file provided (as argument or 'file' environment variable), aborting." if csv_file.nil?
    puts "csv file = #{csv_file}"
    require 'fastercsv'


    # Import Category Name Mappings
    @catmap = YAML::load_file(File.join(RAILS_ROOT, 'config/category_name_mappings.yml'))

    FasterCSV.foreach(csv_file, :headers => true, :col_sep => "\t") do |row|

      interview = Interview.find_or_initialize_by_archive_id row.field('Archiv-ID')

      # TODO: this is dirty - a check vs hard-coded string!
      unless row.field('Online veröffentlicht') == "nicht online" # this is NEVER the case!

        # handle origin data depending on research state
        origin = row.field('Geburtsort')
        if origin.blank? || origin == 'unerschlossen'
          origin = row.field('Herkunft')
          if origin.nil? || origin.length > 45
            origin = row.field('Herkunft (Land)') || '&mdash;'
          end
        else
          country = row.field('Herkunft (Land)')
          origin += ', ' + country.to_s unless origin.include?(country)
        end

        interview.attributes = {      :full_title => row.field('Zeitzeuge'),
                                      :interview_date => row.field('Datum des Interviews'),
                                      :gender => row.field('Geschlecht') == "männlich" ? true : false,
                                      :date_of_birth => row.field("Geburtsdatum"),
                                      :country_of_origin => row.field('Herkunft (Land)'),
                                      :video => row.field("Medium") == "Video" ? true : false,
                                      :duration => row.field("Dauer"),
                                      :translated => row.field("Übersetzung ins Deutsche") == "übersetzt" ? true : false,
                                      :forced_labor_locations => row.field("Orte der Zwangsarbeit"),
                                      :details_of_origin => "-",
                                      :deportation_date => row.field("Datum der Deportation"),
                                      :deportation_location => row.field('Ort der Deportation'),
                                      :punishment => row.field('Strafmaßnahmen'),
                                      :return_locations => row.field('Rückkehr-Ort'),
                                      :return_date => row.field('Datum der Rückkehr'),
                                      :liberation_date => row.field('Datum der Befreiung'),
                                      :interviewers => row.field('Interviewführung'),
                                      :transcriptors => row.field('Transkription'),
                                      :translators => row.field('Übersetzung'),
                                      :researchers => row.field('Wissenschaftliche Erschließung'),
                                      :proofreaders => row.field('Lektorat'),
                                      :segmentators => row.field('Segmentierung')
        }

        collection = Collection.find_or_initialize_by_name row.field('Teilsammlung')
        collection.project_id = collection.name.gsub(/[^\w]/,'_').underscore
        collection.save! if collection.new_record?

        interview.collection_id = collection.id

        interview.save

        unless interview.valid?
          raise "INVALID: #{interview.errors.full_messages}\n\n#{interview.inspect}\n"
        end

        # create missing tapes
        number_of_tapes = (row.field('Bänder') || 0).to_i 
        tapes_created = 0
        unless number_of_tapes == interview.tapes.size
          tape_index = 0
          number_of_tapes.times do
            tape_index += 1
            media_id = interview.archive_id.upcase + "_#{number_of_tapes.to_s.rjust(2,'0')}_#{tape_index.to_s.rjust(2,'0')}"
            tape = interview.tapes.find_or_initialize_by_media_id(media_id)
            if tape.new_record?
              tape.save
              tapes_created += 1
            end
          end
        end

        Category::ARCHIVE_CATEGORIES.each do |category_class|
          interview.send(category_class.first.to_s + "_categorizations").delete_all
          category_field = category_class.last
          (row.field(category_field) || '').gsub(' und ', ';').split(';').each do |classification|
            classification.strip!
            unless @catmap[category_class.first.to_s].nil?
              classification = @catmap[category_class.first.to_s][classification] || classification
            end
            category = Category.find_by_name_and_category_type classification, category_field
            category ||= Category.create{|c| c.name = classification; c.category_type = category_field }
            raise "Invalid Category: #{category.inspect}" unless category.valid?
            unless interview.send(category_class.first).include?(category)
              interview.send(category_class.first.to_s + "_categorizations").create do |categorization|
                categorization.category_type = category.category_type
                categorization.category_id = category.id
              end
            end
          end
        end

        puts "#{interview.full_title} hinzugefügt / aktualisiert.#{(tapes_created > 0) ? "(#{tapes_created} Bänder erstellt)" : ''}"

      else

        unless interview === nil
          puts "Lösche #{interview.full_title}!"
          interview.delete
        end

      end

    end

    # TODO: Delete all unused categories

  end

  desc "Import von Tapes"
  task :tapes, [ :file ] => :environment do |task, args|
    csv_file = args[:file] || ENV['file']
    raise "no csv file provided (as argument or 'file' environment variable), aborting." if csv_file.nil?
    puts "csv file = #{csv_file}"
    require 'fastercsv'

    tape_ids = []
    previous_interview = 0

    FasterCSV.foreach(csv_file, :headers => true, :col_sep => "\t") do |row|

      interview = Interview.find_by_archive_id row.field('Media-ID')[/^ZA\d{3}/i].downcase

      next if interview.nil?

      if interview.id != previous_interview
        puts "#{tape_ids.join(', ')}" unless tape_ids.empty?
        tape_ids = []
        previous_interview = interview.id
      end

      unless interview == nil
        tape = Tape.find_by_media_id row.field('Media-ID').upcase
        tape ||= Tape.create :media_id => row.field('Media-ID')
        tape.interview_id = interview.id
        tape.media_id = row.field('Media-ID')
        tape.duration = Timecode.new(row.field('Duration') || '').time
        tape.save!

        tape_ids << tape.media_id

      end

    end

    puts "#{tape_ids.join(', ')}" unless tape_ids.empty?

  end

  desc "Import von Segmenten"
  task :segments, [ :file ] => :environment do |task, args|
    csv_file = args[:file] || ENV['file']
    raise "no csv file provided (as argument or 'file' environment variable), aborting." if csv_file.nil?
    puts "csv file = #{csv_file}"
    require 'fastercsv'

    FasterCSV.foreach(csv_file, :headers => true, :col_sep => "\t") do |row|

      archive_id = row.field('Media-ID')[/^ZA\d{3}/i].downcase
      tape_media_id = row.field('Media-ID').gsub(/_\d{4}$/, '')

      # lösche alle bisher gespeicherten Segmente
      # Segment.delete_all(["media_id LIKE '#{archive_id}%'"])

      if @interview.nil? || @interview.archive_id != archive_id
        @interview = Interview.find_by_archive_id(archive_id)
      end
      if @tape.nil? || @tape.media_id != tape_media_id
        @tape = Tape.find_by_media_id tape_media_id
      end

      unless @interview.nil? or @tape.nil?
        segment = Segment.create  :tape_id => @tape.id,
                                  :media_id => row.field('Media-ID'),
                                  :timecode => row.field('Timecode'),
                                  :transcript => row.field('Transcript'),
                                  :translation => row.field('Translation')

        puts "Segment Nr. #{segment.id} für Interview #{segment.tape.interview.archive_id}"
                      
      end

      

    end

  end

  desc "Import von Captions als Segmente"
  task :captions, [ :file, :archive_id ] => :environment do |task, args|
    file = args[:file] || ENV['file'] || File.join(RAILS_ROOT, 'db/import_files/captions.csv')
    @archive_id = args[:archive_id] || 'za001'
    puts "Importing from file: #{file}"

    require "fastercsv"
    @interview = nil
    @tape = nil
    @section = nil

    FasterCSV.foreach(file, :headers => true, :col_sep => "\t") do |row|

      media_id = row.field('Media-ID')
      archive_id = media_id[/^ZA\d{3}/i].downcase

      next if archive_id < @archive_id

      tape_media_id = media_id.gsub(/_\d{4}$/, '')

      if @interview.nil? || @interview.archive_id != archive_id
        @interview = Interview.find_by_archive_id(archive_id)
      end

      next if @interview.nil?

      if @tape.nil? || @tape.media_id != tape_media_id
        @tape = Tape.find_or_initialize_by_media_id tape_media_id
        @tape.save if @tape.new_record?
      end

      unless @interview.nil? || @tape.nil?
        segment = Segment.find_or_initialize_by_media_id(media_id)

        segment.tape = @tape
        segment.timecode = row.field('Timecode')
        segment.section = row.field('Section')[/\d{1,2}\.{0,1}\d{0,2}/]
        segment.chapter_change = true unless @section == segment.section
        segment.transcript = row.field('Transcript')
        segment.translation = row.field('Translation')
        segment.mainheading = row.field('Main Heading')
        segment.subheading = row.field('Subheading')

        segment.save!

        @section = segment.section

        puts segment.media_id + ' (' + segment.timecode.to_s + ') ' + (segment.section.blank? ? '' : " (#{segment.section})")

      end

    end

  end


  desc "Import captions from all available captions files"
  task :all_captions, [ :dir ] => :environment do |task, args|

    dir = args[:dir] || ENV['dir']
    raise "No directory given! (supply as argument dir=)" unless File.directory?(dir)

    require "open4"

    @logger = ScriptLogger.new('captions_import')

    Dir.glob(File.join(dir, '**', 'captions_za*.csv')).each do |filename|

      @logger.log "Importing captions from #{filename}."

      Open4::popen4("cd #{File.join(File.dirname(__FILE__),'..')} && rake import_old:captions file=#{filename} --trace") do |pid, stdin, stdout, stderr|
        stdout.each_line {|line| @logger.log line }
        errors = []
        stderr.each_line {|line| errors << line unless line.empty?}
        @logger.log "\nImport der Transkriptionen - FEHLER:\n#{errors.join("\n")}" unless errors.empty?
      end

    end

  end


  desc "Checks captions for completeness of segment import from captions files"
  task :check_captions, [ :file ] => :environment do |task, args|

    file = args[:file]
    raise "Please supply a file= argument." if file.nil?
    raise "No such file #{file}" unless File.exists?(file)

    puts "Checking captions import for '#{file}'"

    missing = 0
    number_of_segments = 0

    archive_id = nil

    FasterCSV.foreach(file, :headers => true, :col_sep => "\t") do |row|
      if archive_id.nil?
        archive_id = row.field('Media-ID').blank? ? nil : row.field('Media-ID')[/^\w{2}\d{3}/]
        puts "Interview: #{archive_id}" unless archive_id.nil?
      end
      timecode = row.field('Timecode')
      next if timecode.blank?
      number_of_segments += 1
      next unless Segment.find(:first, :conditions => ['timecode = ?', timecode]).nil?
      missing += 1
      if missing < 11
        puts timecode
      else
        STDOUT.printf '.'
        STDOUT.flush
      end
    end

    puts
    puts "#{number_of_segments} captions in file."
    puts "#{missing} segments missing in database."
    puts "done."

  end


  desc "Checks captions import from all available captions files"
  task :check_all_captions, [ :dir ] => :environment do |task, args|

    dir = args[:dir] || ENV['dir']
    raise "No directory given! (supply as argument dir=)" unless File.directory?(dir)

    require "open4"

    @logger = ScriptLogger.new('captions_check')

    Dir.glob(File.join(dir, '**', 'captions_za*.csv')).each do |filename|

      @logger.log "Checking captions from #{filename}."

      Open4::popen4("cd #{File.join(File.dirname(__FILE__),'..')} && rake import_old:check_captions file=#{filename} --trace") do |pid, stdin, stdout, stderr|
        stdout.each_line {|line| @logger.log line }
        errors = []
        stderr.each_line {|line| errors << line unless line.empty?}
        @logger.log "\nCaptions-Check - FEHLER:\n#{errors.join("\n")}" unless errors.empty?
      end

    end

  end



  desc "Import von Interview-Überschriften für einzelne Tapes"
  task :headings, [ :file ] => :environment do |task, args|
    file = args[:file] || ENV['file']
    raise "no csv file provided (as argument or 'file' environment variable), aborting." if file.nil?
    puts "csv file = #{file}"
    require 'fastercsv'

    filename = file.split('/').last

    section = 0
    subsection = 0

    rows = 0

    FasterCSV.foreach(file, :headers => true, :col_sep => "\t") do |row|

      rows += 1

      unless row.field("Main Heading").blank? and row.field("Subheading").blank?
        timecode = row.field("Timecode")
        segment = Segment.find(:first, :conditions => [ 'media_id = ? and timecode = ?', row.field('Media-ID'), timecode ])

        if segment.nil?
          puts "Found no segment for #{row.field('Main Heading') || row.field('Subheading')} [#{timecode}]"
        else
          unless row.field('Main Heading').blank?
            section += 1
            subsection = 0
            segment.mainheading = row.field('Main Heading')
            puts "#{section}. [#{timecode}] #{segment.mainheading}"
          end
          unless row.field('Subheading').blank?
            subsection += 1
            segment.subheading = row.field('Subheading')
            puts "#{section}.#{subsection}. [#{timecode}] #{segment.subheading}"
          end
          segment.save! if segment.changed?
        end

      end

    end

    puts "Found #{rows} rows in CSV."


  end

  desc "Import von Interview-Überschriften für alle Interviews"
  task :all_headings, [ :file ] => :environment do |task, args|
    file = args[:file] || ENV['file']
    raise "no csv file provided (as argument or 'file' environment variable), aborting." if file.nil?
    puts "csv file = #{file}"
    require 'fastercsv'

    FasterCSV.foreach(file, :headers => true, :col_sep => "\t") do |row|

      tape = Tape.find(:first, :conditions => {:media_id => row.field("Tape_Media_ID")})
      segment = Segment.find(:first, :conditions => {:media_id => row.field("Media_ID")})

      unless segment == nil or tape == nil
        mainheading = row.field("Mainheading").strip
        subheading = row.field("Subheading").strip
        unless mainheading == "NULL" and subheading == "NULL"
          segment.mainheading = mainheading
          segment.subheading = subheading
          segment.save!
        end
      else
        puts "#{row.field("Media_ID")} nicht hinzugefügt"
      end
    end
  end

  desc "Import der Credits für alle Interviews"
  task :credits, [ :file ] => :environment do |task, args|
    file = args[:file] || ENV['file']
    raise "no csv file provided (as argument or 'file' environment variable), aborting." if file.nil?
    puts "csv file = #{file}"
    require 'fastercsv'

    FasterCSV.foreach(file, :headers => true, :col_sep => "\t") do |row|

      interview = Interview.find_by_archive_id(row.field('Archiv-ID'))
      unless interview.nil?

        { :interviewers => 'Interview',
          :transcriptors => 'Transkription',
          :translators => 'Übersetzung',
          :researchers => 'Erschliessung',
          :proofreaders => 'Lektorat',
          :segmentators => 'Segmentierung' }.each do |attr, field_name|

          interview.send(attr.to_s + '=', row.field(field_name)) unless row.field(field_name).blank?

        end

        puts interview.archive_id

        interview.save!

      end

    end

  end


  desc "Import der Photos entsprechend einer CSV-Datei"
  task :photos, [:file] => :environment do |task,args|
    file = args[:file] || ENV['file']
    raise "no csv file provided (as argument or 'file' environment variable), aborting." if file.nil?
    puts "csv file = #{file}"
    require 'fastercsv'

    photo_path = File.join(ActiveRecord.path_to_photo_storage, 'FOTOS SEZ META_renamed', 'FOTOS_SEZ_META_renamed')

    FasterCSV.foreach(file, :headers => true, :col_sep => "\t") do |row|

      interview = Interview.find_by_archive_id(row.field('Archiv-ID'))
      next if interview.nil?

      photo = Photo.find_or_initialize_by_interview_id_and_photo_file_name(interview.id, row.field('Dateiname'))

      if row.field('Freigabe') != 'true'
        photo.destroy unless photo.new_record?
        puts "Deleting #{photo.photo_file_name}"
      else
        photo.caption = row.field('Bildtitel')
        if photo.new_record?
          files = Dir.glob(File.join(photo_path, "#{row.field('Dateiname').sub(/\.\w{3}$/,'')}.{jpg,JPG,png,PNG}"))
          next if files.empty?
          photo.photo = File.open(files.first)
          puts "#{photo.photo_file_name} added"
        else
          puts "#{photo.photo_file_name} updated"
        end
        photo.save!
      end

    end

  end

end