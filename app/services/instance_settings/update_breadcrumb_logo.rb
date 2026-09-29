module InstanceSettings
  class UpdateBreadcrumbLogo < ApplicationService
    ATTRIBUTES = %w(breadcrumb_logo secondary_breadcrumb_logo).freeze
    FILENAMES_BY_CONTENT_TYPE = {
      'image/png' => 'png',
      'image/svg+xml' => 'svg',
    }.freeze

    def initialize(instance_setting:, attribute:, upload:)
      @instance_setting = instance_setting
      @attribute = attribute.to_s
      @upload = upload
    end

    def perform
      return add_error(:invalid_content_type) unless ATTRIBUTES.include?(@attribute)
      return add_error(:invalid_content_type) if @upload.blank?
      return add_error(:file_too_large) if @upload.size > InstanceSetting::BREADCRUMB_LOGO_MAX_FILE_SIZE

      content_type = detected_content_type
      extension = FILENAMES_BY_CONTENT_TYPE[content_type]
      return add_error(:invalid_content_type) unless extension

      @upload.rewind
      @instance_setting.public_send(@attribute).attach(
        io: @upload,
        filename: "#{@attribute}.#{extension}",
        content_type: content_type
      )
      @instance_setting.touch
      @instance_setting
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
      @instance_setting.errors.add(@attribute, error)
      @instance_setting
    end
  end
end
