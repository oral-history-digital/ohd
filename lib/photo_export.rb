class PhotoExport

  attr_accessor :file_path, :project, :sheet, :interview

  def initialize(archive_id, project)
    @project = project
    @interview = Interview.find_by_archive_id(archive_id)
    @tmp_name = rand(36**8).to_s(36)
  end

  def process
    write_csv
    write_zip
  end
  
  def write_csv
    @project.available_locales.each do |locale|
      CSV.open(File.join(Rails.root, 'tmp', 'files', "#{@tmp_name}-#{locale}.csv"), 'a', col_sep: "\t") do |f|

        f << ['Interview-ID', 'Bild-ID', 'Dateiname', 'Beschreibung', 'Datum', 'Ort', 'Fotograf*in/Urheber*in', 'Quelle/Lizenz', 'Format', 'Öffentlich']

        interview.photos.each do |photo|
          f << [
            interview.archive_id,
            photo.public_id,
            photo.photo_file_name,
            photo.caption(locale),
            photo.date(locale),
            photo.place(locale),
            photo.photographer(locale),
            photo.license(locale),
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
      @project.available_locales.each do |locale|
        zip_file.add("#{@interviews.first.archive_id}_photos_#{locale}_#{DateTime.now.strftime("%Y_%m_%d")}.csv", Rails.root.join('tmp', 'files', "#{@tmp_name}-#{locale}.csv"))
      end
      @interviews.each do |interview|
        interview.photos.each do |photo|
          zip_file.add(photo.photo_file_name || photo.photo.blob.filename, ActiveStorage::Blob.service.path_for(photo.photo.key))
        end
      end
    end

    zip_path
  end

end
