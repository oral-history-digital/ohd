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
    corrected = 0
    regions.keys.each do |name|
      reg = regions[name]
      unless reg[:lat].blank?
        updated = LocationReference.update_all ["region_latitude = ?, region_longitude = ?", reg[:lat], reg[:long]], ["region_name = ?", name]
        puts "#{updated} instances of '#{name}' updated."
        corrected += 1
      end
    end

    puts "\nDone. Completed #{corrected} out of #{total} regions with missing geocodes."

  end


  desc "merges 'interview' relation locations into first non-interview counterpart"
  task :merge_interview_locations => :environment do

    index = 0
    num = 0
    LocationReference.find_each(:conditions => "reference_type = 'interview'") do |location|
      next if location.location_segments.empty?
      index += 1
      STDOUT.printf '.'; STDOUT.flush
      merge_location = LocationReference.find(:first, :conditions => ["interview_id = ? AND name = ? AND reference_type != 'interview'", location.interview_id, location.name])
      next if merge_location.nil?
      merged = LocationSegment.update_all "location_reference_id = #{merge_location.id}", "location_reference_id = #{location.id}"
      puts "\n... merged #{merged} location segments to #{merge_location.reference_type} for '#{location.name}' (#{location.interview.archive_id})."
      num += 1
    end

    puts "\ndone. Merged #{num} location_references of #{index} interview references with segments."

    Rake::Task['solr:reindex:locations'].execute

  end

end