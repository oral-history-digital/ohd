namespace :import do

  desc "Import der Teilsammlungen"
  task :collections => :environment do
    csv_file = ENV['file']
    raise "no csv file provided (file= ), aborting." if csv_file.nil?
    puts "csv file = #{csv_file}"
    require 'fastercsv'

    FasterCSV.foreach(csv_file, :headers => true, :col_sep => "\t") do |row|

      collection = Collection.find_by_name row.field('Projekt')
      collection ||= Collection.create :name => row.field('Projekt')

      puts "Teilsammlung #{collection.name} hinzugefügt"

    end

  end

  desc "Import der Interviewdaten"
  task :metadata => :environment do
    csv_file = ENV['file']
    raise "no csv file provided (file= ), aborting." if csv_file.nil?
    puts "csv file = #{csv_file}"
    require 'fastercsv'

    FasterCSV.foreach(csv_file, :headers => true, :col_sep => "\t") do |row|

      interview = Interview.find_by_archive_id row.field('Archiv-ID')

      unless row.field('Online veröffentlicht') == "nicht online"

        interview ||= Interview.create :archive_id => row.field('Archiv-ID')

        language = Language.find_by_name row.field('Sprache')
        language ||= Language.create :name => row.field('Sprache')

        interview.update_attributes   :full_title => row.field('Zeitzeuge/Zeitzeugin'),
                                      :gender => row.field('Geschlecht') == "männlich" ? true : false,
                                      :date_of_birth => row.field("Geburtsdatum"),
                                      :country_of_origin => row.field("Herkunft"),
                                      :video => row.field("Medium") == "Video" ? true : false,
                                      :duration => row.field("Dauer"),
                                      :translated => row.field("Übersetzt") == "übersetzt" ? true : false,
                                      :forced_labor_location => row.field("Orte der Zwangsarbeit"),
                                      :details_of_origin => "-",
                                      :deportation_date => row.field("Datum der Deportation")

        collection = Collection.find_by_name row.field('Projekt')
        collection ||= Collection.create :name => row.field('Projekt')

        row.field("Gruppen").split("; ").each do |group|
          forced_labor_group = ForcedLaborGroup.find_by_name group
          forced_labor_group ||= ForcedLaborGroup.create :name => group
          unless forced_labor_group.interviews.include?(interview)
            forced_labor_group.interviews << interview
          end
        end

        row.field("Einsatzbereiche").split("; ").each do |field|
          forced_labor_field = ForcedLaborField.find_by_name field
          forced_labor_field ||= ForcedLaborField.create :name => field
          unless forced_labor_field.interviews.include?(interview)
            forced_labor_field.interviews << interview
          end
        end

        row.field("Unterbringung").split("; ").each do |habitation|
          forced_labor_habitation = ForcedLaborHabitation.find_by_name habitation
          forced_labor_habitation ||= ForcedLaborHabitation.create :name => habitation
          unless forced_labor_habitation.interviews.include?(interview)
            forced_labor_habitation.interviews << interview
          end
        end


        interview.language_id = language.id
        interview.collection_id = collection.id

        language.save!
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
  task :tapes => :environment do
    csv_file = ENV['file']
    raise "no csv file provided (file= ), aborting." if csv_file.nil?
    puts "csv file = #{csv_file}"
    require 'fastercsv'

    FasterCSV.foreach(csv_file, :headers => true, :col_sep => "\t") do |row|

      interview = Interview.find_by_archive_id row.field('Media-ID')[/^ZA\d{3}/i].downcase

      unless interview == nil
        tape = Tape.find_by_media_id row.field('Media-ID')
        tape ||= Tape.create :media_id => row.field('Media-ID')
        tape.interview_id = interview.id
        tape.media_id = row.field('Media-ID')
        tape.save!

      end

      puts "#{interview.archive_id}" unless interview == nil

    end

  end

  desc "Import von Sgementen"
  task :segments => :environment do
    csv_file = ENV['file']
    raise "no csv file provided (file= ), aborting." if csv_file.nil?
    puts "csv file = #{csv_file}"
    require 'fastercsv'

    FasterCSV.foreach(csv_file, :headers => true, :col_sep => "\t") do |row|

      archive_id = row.field('Media-ID')[/^ZA\d{3}/i].downcase
      tape_media_id = row.field('Media-ID').gsub(/_\d{4}$/, '')

      # lösche alle bisher gespeicherten Segmente
      # Segment.delete_all(["media_id LIKE '#{archive_id}%'"])

      interview = Interview.find_by_archive_id archive_id
      tape = Tape.find_by_media_id tape_media_id

      unless interview == nil or tape == nil
        segment = Segment.create  :tape_id => tape.id,
                                  :media_id => row.field('Media-ID'),
                                  :timecode => row.field('Timecode'),
                                  :transcript => row.field('Transcript'),
                                  :translation => row.field('Translation')

        puts "Segment Nr. #{segment.id} für Interview #{segment.tape.interview.archive_id}"
                      
      end

      

    end

  end

end