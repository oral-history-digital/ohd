namespace :locations do

  desc "Geocodes missing regional latitude and longitudes"
  task :region_geocodes => :environment do

    regions = {}
    index = 0
    puts "Looking for regions with missing latitude/longitude:"
    LocationReference.find_each({:conditions => ["region_latitude IS NULL OR region_latitude = ''"]}) do |location|
      next if location.region_name.blank?
      regions[location.region_name] = { :lat => '', :long => '' }
      if (index+=1) % 20 == 0
        STDOUT.printf '.'
        STDOUT.flush
      end
    end

    total = regions.keys.size
    puts "\n#{total} distinct regions found with missing geocode information."

    exit

    require 'net/http'

    found = 0
    missing = 0
    puts "Requesting google geocoding service:"
    service_url = 'maps.googleapis.com'
    service_path = '/maps/api/geocode/json'

    index = 0
    region_names = regions.keys.dup
    region_names.each do |name|
      region = regions[name]
      coordinates_retrieved = false
      path = URI::encode(service_path + '?address=' + name + '&sensor=false')
      puts "Requesting geocodes at" + service_url + path
      resp = Net::HTTP.get_response(service_url, path)
      data = ActiveSupport::JSON.decode(resp.body)
      results = data['results']
      if results.nil? || results.empty?
        puts "No data retrieved for request: http://" + service_url + path
        regions.delete(name)
      else
        begin
          location = results.first['geometry']['location']
          region[:lat] = location['lat']
          region[:long] = location['lng']
          coordinates_retrieved = true
        rescue Exception => e
          puts "Error on parsing request: http://" + service_url + path
          puts "ERROR: #{e.message}#{defined?(e.backtrace) ? "\n" + ((e.backtrace || '').to_s) : ''}"
        end
      end
      if coordinates_retrieved
        found += 1
      else
        missing += 1
      end
      index += 1
      break if index > 2000
    end

    puts "Discovered #{found} geocodes. Storing to DB"
    regions.keys.each do |name|
      reg = regions[name]
      unless reg[:lat].blank?
        updated = LocationReference.update_all ["region_latitude = ?, region_longitude = ?", reg[:lat], reg[:long]], ["region_name = ?", name]
        puts "#{updated} instances of '#{name}' updated."
      end
    end

    puts "\nDone."

  end

end