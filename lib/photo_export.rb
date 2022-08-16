class PhotoExport

  attr_accessor :project, :interview, :tmp_name

  def initialize(archive_id, project)
    @project = project
    @interview = Interview.find_by_archive_id(archive_id)
    @tmp_name = rand(36**8).to_s(36)
  end

  def process
    zip_path = Rails.root.join('tmp', 'files', "#{tmp_name}.zip")

    Zip::File.open(zip_path, create: true) do |zip_file|
      project.available_locales.each do |locale|
        zip_file.get_output_stream("#{interview.archive_id}_photos_#{locale}_#{DateTime.now.strftime("%Y_%m_%d")}.csv") {|f| f.puts(interview.photos_csv(locale))}
      end
      interview.photos.each do |photo|
        zip_file.add(photo.photo_file_name || photo.photo.blob.filename, ActiveStorage::Blob.service.path_for(photo.photo.key))
      end
    end

    zip_path
  end

end
