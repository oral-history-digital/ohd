class ReadBulkRegistryEntriesFileJob < ApplicationJob
  queue_as :default

  def perform(file_path, receiver, project, locale)
    read_file(file_path, project, locale)

    #WebNotificationsChannel.broadcast_to(
      #receiver,
      #title: 'edit.upload_bulk_metadata.processed',
      #file: File.basename(file_path),
    #)

    AdminMailer.with(receiver: receiver, type: 'read_campscape', file: file_path).finished_job.deliver_now
    File.delete(file_path) if File.exist?(file_path)
  end

  def read_file(file_path, project, locale)
    I18n.locale = locale

    csv_options = { col_sep: ";", row_sep: :auto, quote_char: "\x00"}
    csv = Roo::CSV.new(file_path, csv_options: csv_options)
    if csv.first.length == 1
      csv_options.update(col_sep: "\t")
      csv = Roo::CSV.new(file_path, csv_options: csv_options)
    end

    csv.each_with_index do |data, index|
      unless index == 0

        parent_name = data[0]
        parent_id   = data[1]
        names       = data[2]
        id          = data[3]
        latitude    = data[4]
        longitude   = data[5]

        begin
          unless names.blank? && id.blank?
            entry = nil
            entry_attributes = {
              latitude: latitude,
              longitude: longitude,
              workflow_state: 'public',
              list_priority: false
            }
            parent = nil

            #
            # if id is given the entry will be updated,
            # otherwise it will be created
            #
            if id
              entry = RegistryEntry.find(id)
              entry.update_attributes(entry_attributes)
            else
              entry = RegistryEntry.create(entry_attributes)
            end
            entry.update_or_create_names(locale, names)

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
              parent_name = RegistryName.where(descriptor: parent_name).first
              parent = parent_name && parent_name.registry_entry
            end

            RegistryHierarchy.find_or_create_by(ancestor_id: parent.id, descendant_id: entry.id) if parent
          end
        rescue StandardError => e
          log("#{e.message}: #{e.backtrace}")
        end
      end
    end
  end

  def log(text, error=true)
    File.open(File.join(Rails.root, 'log', 'registry_entries_import.log'), 'a') do |f|
      f.puts "* #{DateTime.now} - #{error ? 'ERROR' : 'INFO'}: #{text}"
    end
  end

end

