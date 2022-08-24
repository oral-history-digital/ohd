class PhotoExport

  attr_accessor :project, :interview

  def initialize(archive_id, project)
    @project = project
    @interview = Interview.find_by_archive_id(archive_id)
  end

  def process
    Zip::OutputStream.write_buffer do |zip|
      project.available_locales.each do |locale|
        zip.put_next_entry("#{interview.archive_id}_photos_#{locale}_#{DateTime.now.strftime("%Y_%m_%d")}.csv")
        zip.write(interview.photos_csv(locale))
      end
      interview.photos.each do |photo|
        zip.put_next_entry(photo.photo_file_name || photo.photo.blob.filename)
        zip.write IO.read(ActiveStorage::Blob.service.path_for(photo.photo.key))
      end
    end
  end

end
