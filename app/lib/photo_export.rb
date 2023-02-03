class PhotoExport

  attr_accessor :project, :interview, :only_public

  def initialize(archive_id, project, only_public=true)
    @project = project
    @interview = Interview.find_by_archive_id(archive_id)
    @only_public = only_public
  end

  def process
    Zip::OutputStream.write_buffer do |zip|
      project.available_locales.each do |locale|
        zip.put_next_entry("#{interview.archive_id}_photos_#{locale}_#{only_public ? 'public_' : ''}#{DateTime.now.strftime("%Y_%m_%d")}.csv")
        zip.write(interview.photos_csv(locale, only_public))
      end
      photos = only_public ? interview.photos.where(workflow_state: 'public') :
        interview.photos
      photos.each do |photo|
        zip.put_next_entry(photo.name)
        zip.write IO.read(ActiveStorage::Blob.service.path_for(photo.photo.key))
      end
    end
  end

end
