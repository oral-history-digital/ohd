module InstanceSettings
  class RemoveBreadcrumbLogo < ApplicationService
    ATTRIBUTES = UpdateBreadcrumbLogo::ATTRIBUTES

    def initialize(instance_setting:, attribute:)
      @instance_setting = instance_setting
      @attribute = attribute.to_s
    end

    def perform
      return add_error unless ATTRIBUTES.include?(@attribute)

      attachment = @instance_setting.public_send(@attribute)
      attachment.purge if attachment.attached?
      @instance_setting.touch
      @instance_setting
    end

    private

    def add_error
      @instance_setting.errors.add(@attribute, :invalid_content_type)
      @instance_setting
    end
  end
end
