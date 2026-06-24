require 'test_helper'
require 'ostruct'

class UserProjectSerializerTest < ActiveSupport::TestCase
  test 'includes project shortname and name' do
    project = OpenStruct.new(shortname: 'test', name: 'Test Project')
    user_project = OpenStruct.new(project: project)
    serializer = UserProjectSerializer.new(user_project)

    assert_equal 'test', serializer.shortname
    assert_equal 'Test Project', serializer.name
  end

  test 'handles missing project' do
    user_project = OpenStruct.new(project: nil)
    serializer = UserProjectSerializer.new(user_project)

    assert_nil serializer.shortname
    assert_nil serializer.name
  end
end
