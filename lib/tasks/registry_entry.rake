namespace :registry_entry do

  desc 'export registry-entry with names, translations and registry_references to json'
  task :export_to_json, [:entry_id] => :environment do |t, args|
    registry_entry = RegistryEntry.find args.entry_id
    File.open(File.join(Rails.root, 'tmp', 'files', "registry_entry_#{args.entry_id}.json"),"w") do |f|

      f.puts(registry_entry.to_json(root: true))

      registry_entry.registry_names.each do |registry_name|
        f.puts(registry_name.to_json(root: true))
        registry_name.translations.each do |translation|
          f.puts(translation.to_json(root: "RegistryName::Translation"))
        end
      end

      registry_entry.registry_references.each do |registry_reference|
        f.puts(registry_reference.to_json(root: true))
      end
    end
    p "wrote tmp/files/registry_entry_#{args.entry_id}.json"
  end

  desc 'import registry-entry with names, translations and registry_references from json'
  task :import_from_json, [:file_path] => :environment do |t, args|
    File.foreach args.file_path do |line|
      json = JSON.parse(line)
      json.keys.first.classify.constantize.find_or_create_by json.values.first
    rescue
    end
  end

  desc 'add normdata-id to registry-entries with lat-/lon-values'
  task :add_normdata_id => :environment do |t, args|
    require 'norm_data_api.rb'
    RegistryEntry.with_location.find_each do |registry_entry|
      next if !registry_entry.norm_data.empty?
      rlat = registry_entry.latitude.to_f.round(3)
      rlon = registry_entry.longitude.to_f.round(3)
      puts registry_entry.descriptor(:de)

      results = NormDataApi.new(registry_entry.descriptor(:de), nil, nil).process
      JSON.parse(results)["response"]["items"].each do |result|
        lat = result["Entry"]["Location"]["Latitude"].to_f.round(3)
        lon = result["Entry"]["Location"]["Longitude"].to_f.round(3)
        if rlat == lat && rlon == lon
          norm_data_provider = NormDataProvider.where(api_name: result["Entry"]["Provider"]).first
          nd = NormDatum.create(
            registry_entry_id: registry_entry.id,
            norm_data_provider_id: norm_data_provider.id,
            nid: result["Entry"]["ID"]
          )
          puts "added #{nd.nid}!"
          puts ""
          break
        end
      end
    rescue
    end
  end

end
