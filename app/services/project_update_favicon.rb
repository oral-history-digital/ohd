class ProjectUpdateFavicon < ApplicationService
  def initialize(project:, upload:)
    @project = project
    @upload = upload
  end

  def perform
    return add_error(:invalid_content_type) if @upload.blank?
    return add_error(:file_too_large) if @upload.size > Project::FAVICON_MAX_FILE_SIZE

    content_type = detected_content_type
    filename = Project::FAVICON_FILENAMES_BY_CONTENT_TYPE[content_type]
    return add_error(:invalid_content_type) unless filename

    # Make sure the file pointer is at the beginning of the file
    @upload.rewind

    @project.favicon.attach(
      io: @upload,
      filename: filename,
      content_type: content_type
    )
    @project.touch
    @project
  end

  private

  def detected_content_type
    Marcel::MimeType.for(
      @upload.tempfile,
      name: @upload.original_filename,
      declared_type: @upload.content_type
    )
  end

  def add_error(error)
    @project.errors.add(:favicon, error)
    @project
  end
end
