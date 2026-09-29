require 'test_helper'

class InstanceSettings::UpdateBreadcrumbLogoTest < ActiveSupport::TestCase
  test 'normalizes an uploaded breadcrumb logo filename from its content type' do
    upload = Rack::Test::UploadedFile.new(
      StringIO.new('<svg xmlns="http://www.w3.org/2000/svg"/>'),
      'image/svg+xml',
      original_filename: 'logo.svg'
    )

    InstanceSettings::UpdateBreadcrumbLogo.perform(
      instance_setting: InstanceSetting.current,
      attribute: :breadcrumb_logo,
      upload: upload
    )

    assert InstanceSetting.current.reload.breadcrumb_logo.attached?
    assert_equal 'breadcrumb_logo.svg', InstanceSetting.current.breadcrumb_logo.filename.to_s
  end

  test 'does not replace a breadcrumb logo with an unsupported upload' do
    setting = InstanceSetting.current
    setting.breadcrumb_logo.attach(
      io: StringIO.new('logo'),
      filename: 'breadcrumb_logo.png',
      content_type: 'image/png'
    )
    existing_blob = setting.breadcrumb_logo.blob
    upload = Rack::Test::UploadedFile.new(
      StringIO.new('not an image'),
      'text/plain',
      original_filename: 'logo.txt'
    )

    InstanceSettings::UpdateBreadcrumbLogo.perform(
      instance_setting: setting,
      attribute: :breadcrumb_logo,
      upload: upload
    )

    assert setting.errors.added?(:breadcrumb_logo, :invalid_content_type)
    assert_equal existing_blob, setting.reload.breadcrumb_logo.blob
  end
end
