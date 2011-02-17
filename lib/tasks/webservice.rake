namespace :webservice do

  desc "creates dummy data for the webservice search"
  task :create_dummy_data => :environment do

    [
      { :name => "Leoben, Österreich",
        :location_type => "Ort",
        :latitude => "47.3811667",
        :longitude => "15.097222"
      },
      { :name => "Szeged, Ungarn",
        :location_type => "Ort der Zwangsarbeit",
        :latitude => "46.25",
        :longitude => "20.166667"
      },
      {
          :name => "Leipzig, Deutschland",
          :location_type => "Ort",
          :latitude => "51.340333",
          :longitude => "12.37475"
      },
      {
          :name => "Allendorf (Stadtallendorf)",
          :location_type => "Lager",
          :latitude => "50.833333",
          :longitude => "9.016667"
      },
      {
          :name => "Auschwitz III-Monowitz",
          :location_type => "KZ",
          :latitude => "50",
          :longitude => "20"
      },
      {
          :name => "Conti (Budapest)",
          :location_type => "Gefängnis",
          :latitude => "47.5",
          :longitude => "19.05"
      },
      {
          :name => "Wittenberge-Bad Wilsnacker Straße (Wittenberge)",
          :location_type => "Außenlager",
          :latitude => "52.994831",
          :longitude => "11.752656"
      },
      {
          :name => "Holzbau AG (Gorlice)",
          :location_type => "Firma",
          :latitude => "49.666667",
          :longitude => "21.166667"
      },
      {
          :name => "Röchling'schen Eisen- u. Stahlwerke GmbH (Völklingen)",
          :location_type => "Firma",
          :latitude => "49.253333",
          :longitude => "6.853333"
      }
    ].each do |loc|

      interview = Interview.find(:first, :order => "RAND()")

      puts "creating: " + (LocationReference.create do |ref|
        ref.interview_id = interview.id
        ref.name = loc[:name]
        ref.location_type = loc[:location_type]
        ref.latitude = loc[:latitude]
        ref.longitude = loc[:longitude]
      end.inspect.to_s)

    end

  end


  desc "Imports the locations from CSV data"
  task :csv_import, [:file] => :environment do |task, args|

    deleted = LocationReference.delete_all

    puts "\nRemoved #{deleted} prior location references"

    file = args[:file]

    raise "No such file: '#{file}'.\nPlease specify a valid file= argument." unless File.exists?(file)

    fields = LocationReference.content_columns.map{|c| c.name }

    imported = 0

    FasterCSV.foreach(file, { :headers => true }) do |row|

      interview = Interview.find_by_archive_id(row.field('interview_id'))

      next if interview.nil?

      location = LocationReference.new do |l|
        fields.each do |field_name|
          l.send("#{field_name}=", row.field(field_name))
        end
        l.interview_id = interview.id
      end
      begin
        location.save!
        imported += 1
        puts [location.interview_id, location.location_type, location.name].compact.join(" ")
      rescue Exception => e
        puts "\nERROR: #{e.message}\nLR: #{location.inspect}\nInstance Errors:#{location.errors.full_messages}\n"
      end

    end

    puts "\nImported a total of #{imported} location records. done."

  end

end