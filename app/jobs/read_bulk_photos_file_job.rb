require 'open-uri'

class ReadBulkPhotosFileJob < ApplicationJob
  queue_as :default

  def perform(file_path, receiver, project, locale)
    jobs_logger.info "*** uploading #{file_path} photos"

    # open zip and write content to temporary files
    #
    photos = []
    csv_file_name = ''
    Zip::File.open(file_path) do |zip_file|
      zip_file.each do |entry|
        entry_name = entry.name.split('/').last
        if entry_name.split('.').last == 'csv' 
          csv_file_name = File.join(Rails.root, 'tmp', 'files', entry_name)
          File.open(csv_file_name, 'wb') {|f| f.write entry.get_input_stream.read }
        elsif entry.ftype != :directory
          photo_file_name = File.join(Rails.root, 'tmp', 'files', entry_name)
          photos << photo_file_name
          File.open(photo_file_name, 'wb') {|f| f.write entry.get_input_stream.read }
        end 
      end
    end

    interview = import_photos(photos, csv_file_name, locale)
    File.delete(file_path) if File.exist?(file_path)
    File.delete(csv_file_name) if File.exist?(csv_file_name)

    #WebNotificationsChannel.broadcast_to(
      #receiver,
      #title: 'edit.upload_bulk_photo.processed',
      #file: File.basename(file_path),
    #)

    jobs_logger.info "*** uploaded #{file_path} photos"
    AdminMailer.with(receiver: receiver, type: 'read_bulk_photos', file: file_path).finished_job.deliver_now
  end

  def import_photos(photos, csv_file_name, locale)
    I18n.locale = locale
    csv_options = { col_sep: "\t", row_sep: :auto, quote_char: "\x00" }
    #csv_options = { col_sep: ";", row_sep: :auto, quote_char: "\x00", liberal_parsing: true, encoding: "ISO8859-1:utf-8"  }
    csv = Roo::CSV.new(csv_file_name, csv_options: csv_options)
    if csv.first.length == 1
      csv_options.update(col_sep: ";")
      csv = Roo::CSV.new(csv_file_name, csv_options: csv_options)
    end

    interviews_to_reindex = []

    csv.each_with_index do |data, index|
      begin
        unless index == 0 || data[0].blank? 
          #
          # archive_id;photo_id;photo-file-name;description;date;place;photographer;license;format
          #
          archive_id = data[0]
          if archive_id
            interview = Interview.find_by_archive_id(archive_id)
          else
            log("*** no archive_id found in data: #{data}")
          end

          photo = Photo.find_or_create_by(
            interview_id: interview && interview.id,
            photo_file_name: data[2]
          )

          photo_params = {
            public_id: data[1],
            caption: data[3],
            date: data[4],
            place: data[5],
            photographer: data[6],
            license: data[7],
            photo_content_type: data[8],
            workflow_state: 'unshared'
          }

          # publication state:
          photo_params.update(workflow_state: 'public') if %w(yes y ja j true t).include?(data[9] && data[9].downcase)

          photo.update photo_params

          tmp_photo_path = File.join(Rails.root, 'tmp', 'files', data[2])
          photo.photo.attach(io: File.open(tmp_photo_path), filename: data[2])
          #photo.photo.attach(io: File.open(File.join(Rails.root, 'tmp', 'files', data[2])), filename: data[2], metadata: {title: data[3]})

          photo.write_iptc_metadata

          interviews_to_reindex << interview
          File.delete(tmp_photo_path) if File.exist?(tmp_photo_path)

          if photo.id
            log("saved #{archive_id}: #{data[2]}", false)
          else
            log("*** photo could not be saved because #{photo.errors}! data: '{data}")
          end
        end
      rescue StandardError => e
        log("#{e.message}: #{e.backtrace}")
      end
      Sunspot.index interviews_to_reindex.uniq
      interview
    end
  end

  def log(text, error=true)
    File.open(File.join(Rails.root, 'log', 'photo_import.log'), 'a') do |f|
      f.puts "* #{DateTime.now} - #{error ? 'ERROR' : 'INFO'}: #{text}"
    end
  end

end
