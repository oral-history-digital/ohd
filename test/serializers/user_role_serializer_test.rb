require 'test_helper'
require 'ostruct'

class UserRoleSerializerTest < ActiveSupport::TestCase
  test 'includes archive management flag and project details' do
    project = OpenStruct.new(shortname: 'test', name: 'Test Project')
    role = OpenStruct.new(
      project_id: 1,
      project: project,
      translations: [
        OpenStruct.new(locale: 'en', name: 'Archive Manager'),
        OpenStruct.new(locale: 'de', name: 'Archivmanagement')
      ]
    )
    serializer = UserRoleSerializer.new(OpenStruct.new(role: role))

    assert serializer.archive_management
    assert_equal 'test', serializer.project_shortname
    assert_equal 'Test Project', serializer.project_name
  end
end
