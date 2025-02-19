class ReadBulkRegistryEntriesFileJob < ApplicationJob
  queue_as :default

  def perform(opts)
    read_file(opts[:file_path], opts[:project], opts[:locale])
  end

  def read_file(file_path, project, locale)
    I18n.locale = locale

    csv = Roo::CSV.new(file_path, csv_options: CSV_OPTIONS)
    if csv.first.length == 1
      csv = Roo::CSV.new(file_path, csv_options: CSV_OPTIONS.merge(col_sep: ";"))
    end

    csv.each_with_index do |data, index|
      unless index == 0

        parent_name = data[0]
        parent_id   = data[1]
        name        = data[2]
        id          = data[3]
        description = data[4]
        latitude    = data[5]
        longitude   = data[6]
        gnd_id      = data[7]
        osm_id      = data[8]

        begin
          unless name.blank? && id.blank?
            entry = nil
            entry_attributes = {
              descriptor: name, 
              code: name && name.downcase.gsub(/\s+/, "_"),
              latitude: latitude,
              longitude: longitude,
              notes: description,
              workflow_state: 'public',
              list_priority: false,
              project_id: project.id,
              gnd_id: gnd_id,
              osm_id: osm_id
            }
            parent = nil

            #
            # if id is given the entry will be updated,
            # otherwise it will be created
            #
            if id
              entry = RegistryEntry.find(id)
              entry.update(entry_attributes)
            else
              entry = RegistryEntry.create(entry_attributes)
              RegistryName.create registry_entry_id: entry.id, registry_name_type_id: 1, name_position: 0, descriptor: name, locale: locale
            end

            #
            # reset counter-cache-columns
            #
            RegistryEntry.reset_counters(entry.id, :registry_references, :ancestors, :descendants)


            #
            # Parent`s attributes won`t update!
            # A parent is searched for by id if given.
            # Otherwise a parent is searched by name.
            #
            # To update a parent`s attributes, the parent has to be written in a row with it`s 
            # id and attributes like a normal entry.
            #
            if parent_id
              parent = RegistryEntry.find(parent_id)
            elsif !parent_id && parent_name
              parent = RegistryEntry.joins(registry_names: :translations).
                where("registry_name_translations.descriptor": parent_name).
                where(project_id: project.id).first
            end

            RegistryHierarchy.find_or_create_by(ancestor_id: parent.id, descendant_id: entry.id) if parent
          end
        end
      end
    end
    project.registry_entries.update_all(updated_at: Time.now)
  end

end

