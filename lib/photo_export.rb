class PhotoExport

  attr_accessor :file_path, :project, :locale, :sheet

  def initialize(public_interview_ids, project, locale)
    I18n.locale = locale
    @project = project
    @locale = locale
    @public_interview_ids = public_interview_ids
    @tmp_name = rand(36**8).to_s(36)
  end

  def process
    write_csv
    write_zip
  end
  
  def write_csv
    now = DateTime.now.strftime("%d.%m.%Y-%H.%M")
    CSV.open(File.join(Rails.root, 'tmp', 'files', "#{@tmp_name}.csv"), 'a', col_sep: "\t") do |f|

      f << ['Interview-ID', 'Bild-ID', 'Dateiname', 'Beschreibung', 'Datum', 'Ort', 'Fotograf*in/Urheber*in', 'Quelle/Lizenz', 'Format', 'Öffentlich']

      Interview.where(archive_id: @public_interview_ids).each do |interview|
        interview.photos.each do |photo|
          f << [
            interview.archive_id,
            photo.public_id,
            photo.photo_file_name,
            photo.caption,
            photo.date,
            photo.place,
            photo.photographer,
            photo.license,
            photo.photo_content_type,
            photo.workflow_state == 'public' ? 'ja' : 'nein'
          ]
        end
      end
    end
  end

  def write_zip
    zip_path = Rails.root.join('tmp', 'files', "#{@tmp_name}.zip")

    Zip::File.open(zip_path, create: true) do |zip_file|
      zip_file.add("photos.csv", Rails.root.join('tmp', 'files', "#{@tmp_name}.csv"))
      Interview.where(archive_id: @public_interview_ids).each do |interview|
        interview.photos.each do |photo|
          zip_file.add(photo.photo_file_name, ActiveStorage::Blob.service.path_for(photo.photo.key))
        end
      end
    end

    zip_path
  end

end
