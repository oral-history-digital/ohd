class ReadBulkPhotoFileJob < ApplicationJob
  queue_as :default

  def perform(file_path, receiver)
    read_file(file_path)
    File.delete(file_path) if File.exist?(file_path)
    Interview.reindex
    Rails.cache.redis.keys("#{Project.cache_key_prefix}-interview*").each{|k| Rails.cache.delete(k)}
    AdminMailer.with(receiver: receiver, type: 'read_campscape', file: file_path).finished_job.deliver_now
  end

  def read_file(file_path)
    I18n.locale = :en

    csv = Roo::CSV.new(file_path, csv_options: { col_sep: ";", row_sep: :auto, quote_char: "\x00", force_quotes: true })
    csv.each_with_index do |data, index|
      begin
        unless data[0].blank? 
          interview = Interview.find_by_archive_id(data[0])

          photo = Photo.create(interview_id: interview.id, photo_file_name: data[1], photo_content_type: data[2], photo_file_size: data[3])
          photo.photo.attach(io: file(data), filename: data[1], metadata: {title: data[4]})
          photo.write_iptc_metadata({title: data[4]}) if data[4]

        end
      rescue StandardError => e
        log("#{e.message}: #{e.backtrace}")
      end
    end
  end

  def log(text, error=true)
    File.open(File.join(Rails.root, 'tmp', 'metadata_import.log'), 'a') do |f|
      f.puts "* #{DateTime.now} - #{error ? 'ERROR' : 'INFO'}: #{text}"
    end
  end

  def file(data)
    # TODO: generalize this for future tasks
    File.open("../unpublished_exported_from_zwar_platform/files/#{data[0]}/photos/#{data[1]}")
  end
end
