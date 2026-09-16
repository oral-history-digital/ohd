require 'test_helper'
require 'securerandom'

class ApplicationControllerTest < ActiveSupport::TestCase
  test 'initial projects payload includes configured umbrella project' do
    umbrella_project = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a")
    current_project = DataHelper.test_project(shortname: "cur#{SecureRandom.hex(2)}a")
    InstanceSetting.current.update!(umbrella_project: umbrella_project)
    controller = ApplicationController.new
    controller.define_singleton_method(:cache_single) do |project, serializer_name: nil|
      { id: project.id, serializer_name: serializer_name }
    end

    payload = controller.send(
      :build_initial_projects_payload,
      current_project: current_project,
      umbrella_project: InstanceSetting.current.umbrella_project,
      on_umbrella_portal: false
    )

    assert_equal 'fetched', payload[:project_statuses][umbrella_project.id.to_s]
    assert_equal umbrella_project.id, payload[:projects_data][umbrella_project.id.to_s][:id]
    assert_equal 'ProjectBase', payload[:projects_data][umbrella_project.id.to_s][:serializer_name]
    assert_equal current_project.id, payload[:projects_data][current_project.id.to_s][:id]
  end

  test 'project serialization cache changes with umbrella setting' do
    project = DataHelper.test_project(shortname: "cch#{SecureRandom.hex(2)}a")
    setting = InstanceSetting.current
    setting.update!(umbrella_project: project)
    controller = ApplicationController.new
    controller.define_singleton_method(:current_project) { project }

    first_payload = controller.send(:cache_single, project, serializer_name: 'ProjectBase')
    setting.update!(umbrella_project: Project.find_by!(shortname: 'ohd'))
    second_payload = controller.send(:cache_single, project, serializer_name: 'ProjectBase')

    assert first_payload[:is_umbrella]
    assert_not second_payload[:is_umbrella]
  end
end
