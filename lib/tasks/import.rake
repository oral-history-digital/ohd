namespace :import do

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
  task :metadata, [ :file ] => :environment do |task, args|
    puts "ARGUMENTS: #{args.inspect}"
    csv_file = args[:file] || ENV['file']
    raise "no csv file provided (as argument or 'file' environment variable), aborting." if csv_file.nil?
    puts "csv file = #{csv_file}"
    require 'fastercsv'

    FasterCSV.foreach(csv_file, :headers => true, :col_sep => "\t") do |row|

      interview = Interview.find_by_archive_id row.field('Archiv-ID')

      unless row.field('Online veröffentlicht') == "nicht online"

        interview ||= Interview.create :archive_id => row.field('Archiv-ID')

        interview.update_attributes   :full_title => row.field('Zeitzeuge/Zeitzeugin'),
                                      :gender => row.field('Geschlecht') == "männlich" ? true : false,
                                      :date_of_birth => row.field("Geburtsdatum"),
                                      :country_of_origin => row.field("Herkunft"),
                                      :video => row.field("Medium") == "Video" ? true : false,
                                      :duration => Timecode.new((row.field("Dauer in s") || '').to_i).time,
                                      :translated => row.field("Übersetzt") == "übersetzt" ? true : false,
                                      :forced_labor_location => row.field("Orte der Zwangsarbeit"),
                                      :details_of_origin => "-",
                                      :deportation_date => row.field("Datum der Deportation")

        collection = Collection.find_by_name row.field('Projekt')
        collection ||= Collection.create :name => row.field('Projekt')

        Category::ARCHIVE_CATEGORIES.each do |category_class|
          category_field = category_class.last
          (row.field(category_field) || '').split(';').each do |classification|
            classification.strip!
            category = Category.find_by_name_and_category_type classification, category_field
            category ||= Category.create{|c| c.name = classification; c.category_type = category_field }
            interview.send(category_class.first.to_s + "_categorizations").create do |categorization|
              categorization.category_type = category.category_type
              categorization.category_id = category.id
            end
          end
        end

        interview.collection_id = collection.id

        interview.save!
        collection.save!

        puts "#{interview.full_title} hinzugefügt / aktualisiert."

      else

        unless interview === nil
          puts "Lösche #{interview.full_title}!"
          interview.delete
        end

      end

    end

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
  task :captions, [ :file ] => :environment do |task, args|
    file = args[:file] || ENV['file'] || File.join(RAILS_ROOT, 'db/import_files/captions.csv')
    puts "Importing from file: #{file}"

    require "fastercsv"
    @interview = nil
    @tape = nil
    @section = nil

    FasterCSV.foreach(file, :headers => true, :col_sep => "\t") do |row|

      media_id = row.field('Media-ID')
      archive_id = media_id[/^ZA\d{3}/i].downcase
      tape_media_id = media_id.gsub(/_\d{4}$/, '')

      if @interview.nil? || @interview.archive_id != archive_id
        @interview = Interview.find_by_archive_id(archive_id)
      end
      if @tape.nil? || @tape.media_id != tape_media_id
        @tape = Tape.find_by_media_id tape_media_id
      end

      unless @interview.nil? || @tape.nil?
        segment = Segment.find_or_initialize_by_media_id(media_id)

        segment.tape = @tape
        segment.timecode = row.field('Timecode')
        segment.section = row.field('Section')
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

  desc "Import von Interview-Überschriften für einzelne Tapes"
  task :headings, [ :file ] => :environment do |task, args|
    file = args[:file] || ENV['file']
    raise "no csv file provided (as argument or 'file' environment variable), aborting." if file.nil?
    puts "csv file = #{file}"
    require 'fastercsv'

    filename = file.split('/').last

    tape_media_id = filename.gsub(/.csv$/, '')

    puts "#{tape_media_id}"

    tape = Tape.find(:first, :conditions => { :media_id => tape_media_id.upcase })

    unless tape == nil

      FasterCSV.foreach(file, :headers => true, :col_sep => "\t") do |row|

        unless row.field("Hauptüberschrift") == nil and row.field("Zwischenüberschrift") == nil
          timecode = row.field("Timecode")
          segment = Segment.find(:first, :conditions => "media_id LIKE '#{tape_media_id}%' AND timecode = '#{timecode}'")


          unless segment == nil
            heading = Heading.find(:first, :conditions => { :tape_id => tape.id, :media_id => segment.media_id})
            heading ||= Heading.create  :tape_id => tape.id, :media_id => segment.media_id

            heading.update_attributes :segment_id => segment.id


            if row.field("Hauptüberschrift") == nil
              heading.mainheading = false
              heading.title = row.field("Zwischenüberschrift")
            else
              heading.mainheading = true
              heading.title = row.field("Hauptüberschrift")
            end

            heading.save!
            puts "#{heading.media_id}"

          end
        end

      end

    end

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
          unless mainheading == "NULL"
            heading = Heading.find(:first, :conditions => { :segment_id => segment.id, :media_id => segment.media_id, :mainheading => true})
            heading ||= Heading.create :segment_id => segment.id, :media_id => segment.media_id, :mainheading => true
            heading.update_attributes :tape_id => tape.id, :title => mainheading
            heading.save!
            puts "Hauptueberschrift fuer #{heading.media_id} hinzugefuegt / aktualisiert"
          end

          unless subheading == "NULL"
            heading = Heading.find(:first, :conditions => { :segment_id => segment.id, :media_id => segment.media_id, :mainheading => false})
            heading ||= Heading.create :segment_id => segment.id, :media_id => segment.media_id, :mainheading => false
            heading.update_attributes :tape_id => tape.id, :title => subheading
            heading.save!
            puts "Zwischenueberschrift fuer #{heading.media_id} hinzugefuegt / aktualisiert"
          end

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

end