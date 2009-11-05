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
          forced_labor_group.interviews << interview
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

end