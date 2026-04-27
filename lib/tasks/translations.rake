namespace :translations do
  desc "Export TranslationValue records to flat YAML files by locale"
  task :export, [:set] => :environment do |_, args|
    # Exports all TranslationValue records from the database into versioned YAML
    # files grouped by locale. Keys are written in flat dot notation and values
    # are serialized as quoted strings to ensure they remain strings when parsed.
    #
    # The exported files serve as default translation snapshots that can be
    # committed to the repository, allowing changes to translations to be tracked
    # in Git and used to bootstrap or restore database contents.
    #
    # Output location: config/translations/<locale>.yml
    #
    # Usage:
    #   bin/rails translations:export

    set = args[:set] || "default"

    output_dir = Rails.root.join("config/translations", set)
    FileUtils.mkdir_p(output_dir)

    data = Hash.new { |h, k| h[k] = {} }

    TranslationValue.includes(:translations).find_each do |tv|
        tv.translations.each do |translation|
            locale = translation.locale.to_s
                data[locale][tv.key] = translation.value.to_s
            end
        end

        data.each do |locale, translations|
        file_path = output_dir.join("#{locale}.yml")

        yaml = +"#{locale}:\n"

        translations.sort.each do |key, value|
            yaml << "  #{key}: #{value.to_json}\n"
        end

        File.write(file_path, yaml)

        puts "Exported #{locale}: #{translations.size} keys"
        end
    end

    task :import, [:set, :overwrite, :dry_run] => :environment do |_, args|
        # Imports translations from YAML files in config/translations/<set>/ into the
        # TranslationValue database table.
        #
        # Each YAML file must contain a locale root key and flat dot-notation keys,
        # matching the format produced by `translations:export`.
        #
        # By default the task only creates missing translations and will NOT overwrite
        # existing values in the database. Overwriting must be explicitly enabled.
        #
        # A dry-run mode is available to preview what would be created or updated
        # without making any database changes.
        #
        # Arguments:
        #   set        - translation set folder inside config/translations (default: "default")
        #   overwrite  - "true" to allow updating existing translations
        #   dry_run    - "true" to simulate the import without modifying the database
        #
        # Examples:
        #   bin/rails translations:import[oral_history]             # import, no overwrite
        #   bin/rails translations:import[oral_history,true]        # import, overwrite
        #   bin/rails translations:import[oral_history,false,true]  # import, no overwrite, dry run
        #   bin/rails translations:import[oral_history,true,true]   # import, overwrite, dry run

        set       = args[:set] || "default"
        overwrite = args[:overwrite] == "true"
        dry_run   = args[:dry_run] == "true"

        if overwrite && !dry_run
            puts "WARNING: This will overwrite existing translations."
            print "Continue? (yes/no): "
            exit unless STDIN.gets.strip == "yes"
        end

        input_dir = Rails.root.join("config/translations", set)

        unless Dir.exist?(input_dir)
            puts "Translation set not found: #{set}"
            exit 1
        end

        puts "Importing translations from #{input_dir}"
        puts "Overwrite enabled: #{overwrite}"
        puts "Dry run: #{dry_run}"

        created = 0
        updated = 0
        skipped = 0

        ActiveRecord::Base.logger.silence do
            Dir.glob(input_dir.join("*.yml")).each do |file|
                data = YAML.safe_load_file(file, permitted_classes: [], aliases: false) # Allow primitive types only

                data.each do |locale, translations|
                    locale = locale.to_s

                    translations.each do |key, value|

                        incoming = value.to_s

                        tv = TranslationValue.find_or_create_by(key: key)
                        translation_record = tv.translations.find { |t| t.locale.to_s == locale }

                        existing = translation_record&.value.to_s

                        if translation_record.nil?
                            created += 1

                            unless dry_run
                            tv.update(value: incoming, locale: locale)
                        end

                        elsif overwrite && existing != incoming
                            updated += 1

                            unless dry_run
                            translation_record.update!(value: incoming)
                        end

                        else
                            skipped += 1
                        end
                    end
                end
            end
        end

        puts "Import finished"
        puts "Created: #{created}"
        puts "Updated: #{updated}"
        puts "Skipped: #{skipped}"

        puts "(dry run – no database changes made)" if dry_run
    end
end