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
    assert_equal false, serializer.is_umbrella
  end

  test 'identifies umbrella membership by instance settings rather than shortname' do
    umbrella = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a")
    InstanceSetting.current.update!(umbrella_project: umbrella)

    # Shared setup supplies ohd; once another project is configured, ohd is ordinary.
    archive = Project.find_by!(shortname: 'ohd')
    [umbrella, archive].each do |project|
      user_project = UserProject.new(project: project, user: User.new)
      payload = UserProjectSerializer.new(user_project).as_json

      assert_equal project == umbrella, payload[:is_umbrella]
    end
  end
end
