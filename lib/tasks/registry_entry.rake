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

end
