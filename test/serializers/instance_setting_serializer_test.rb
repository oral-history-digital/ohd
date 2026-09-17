require 'test_helper'

class InstanceSettingSerializerTest < ActiveSupport::TestCase
  test 'includes configured breadcrumb logo URLs' do
    setting = InstanceSetting.current
    setting.breadcrumb_logo.attach(
      io: StringIO.new('<svg xmlns="http://www.w3.org/2000/svg"/>'),
      filename: 'breadcrumb-logo.svg',
      content_type: 'image/svg+xml'
    )
    setting.secondary_breadcrumb_logo.attach(
      io: StringIO.new('<svg xmlns="http://www.w3.org/2000/svg"/>'),
      filename: 'secondary-breadcrumb-logo.svg',
      content_type: 'image/svg+xml'
    )

    [InstanceSettingSerializer, Admin::InstanceSettingSerializer].each do |serializer|
      payload = serializer.new(setting).as_json

      assert_match %r{/rails/active_storage/blobs/}, payload[:breadcrumb_logo_url]
      assert_match %r{/rails/active_storage/blobs/}, payload[:secondary_breadcrumb_logo_url]
    end
  end
end
