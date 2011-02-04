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
end