require 'open-uri'

class ReadBulkPhotoFileJob < ApplicationJob
  queue_as :default

  def perform(file_path, receiver)
    read_file(file_path)
    File.delete(file_path) if File.exist?(file_path)
    Interview.reindex
    Interview.all.each(&:touch)
    AdminMailer.with(receiver: receiver, type: 'read_campscape', file: file_path).finished_job.deliver_now
  end

  def read_file(file_path)
    csv = Roo::CSV.new(file_path, csv_options: { col_sep: ";", row_sep: :auto, quote_char: "\x00", force_quotes: true })
    csv.each_with_index do |data, index|
      begin
        unless data[0].blank? 
          #
          # dedalo exported:
          #"Photo caption";"Filename";"Photographer";"Original filename";"ID";"Code";"Image";"Img Description";"Publication State"
          #
          archive_id = get_archive_id(data)
          if archive_id
            interview = Interview.find_by_archive_id(archive_id)
          else
            log("*** no archive_id found in data: #{data}")
          end

          img_path = URI.encode(data[6]).gsub('%22', '')
          img = img_path.split('/').last
          photo_params = {interview_id: interview && interview.id, photo_file_name: img}

          # publication state:
          photo_params.update(workflow_state: 'publish') if data[8] == 'Yes'

          photo = Photo.create photo_params
          #photo = Photo.create(interview_id: interview.id, photo_file_name: data[1], photo_content_type: data[2], photo_file_size: data[3])

          open(img_path){|io| photo.photo.attach(io: io, filename: img, metadata: {title:data[7]})}

	    if photo.id
		    log("saved #{archive_id}: #{img}", false)
	    else
		    log("*** photo could not  be saved because #{photo.errors}! data: '{data}")
	    end
#            photo.write_iptc_metadata({title: data[7]}) if data[7]
        end
      rescue StandardError => e
        log("#{e.message}: #{e.backtrace}")
      end
    end
  end

  def log(text, error=true)
    File.open(File.join(Rails.root, 'tmp', 'photo_import.log'), 'a') do |f|
      f.puts "* #{DateTime.now} - #{error ? 'ERROR' : 'INFO'}: #{text}"
    end
  end

  # TODO: this is a preliminary version for a special dedalo export!!
  def get_archive_id(data)
    if data[5] =~ /EOG[-_](\d{3})/
      "mog#{$1}"
    elsif data[3] =~ /EOG[-_](\d{3})/
      "mog#{$1}"
    elsif data[5] =~ /mog(\d{3})/
      "mog#{$1}"
    #"MOG_ORG_070_13_20.jpg"
    elsif data[3] =~ /MOG_ORG_(\d{3}).*/
      "mog#{$1}"
    #"EOG_SK_070_14_20.jpg"
    elsif data[3] =~ /EOG_SK_(\d{3}).*/
      "mog#{$1}"
    #"EOG_ORG_069_01_10.jpg"
    elsif data[3] =~ /EOG_ORG_(\d{3}).*/
      "mog#{$1}"
    elsif data[3] =~ /E0G_ORG_(\d{3}).*/
      "mog#{$1}"
    elsif data[3] =~ /EOG_0RG_(\d{3}).*/
      "mog#{$1}"
    #"Scanned document EOG_070_14_20.jpg"
    elsif data[3] =~ /Scanned document EOG_(\d{3}).*/
      "mog#{$1}"
    end
  end

end
