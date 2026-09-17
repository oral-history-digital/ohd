require "test_helper"

class ProjectSerializerTest < ActiveSupport::TestCase
  test "includes the configured favicon URL" do
    project = DataHelper.test_project(shortname: "fav#{SecureRandom.hex(2)}a")
    project.favicon.attach(
      io: StringIO.new("favicon"),
      filename: "favicon.ico",
      content_type: "image/x-icon"
    )

    full_payload = ProjectSerializer.new(project).as_json
    base_payload = ProjectBaseSerializer.new(project).as_json
    archive_payload = ProjectArchiveSerializer.new(project).as_json

    [full_payload, base_payload, archive_payload].each do |payload|
      assert_match %r{/rails/active_storage/blobs/}, payload[:favicon_url]
    end
  end

  test "returns no favicon URL when none is configured" do
    project = DataHelper.test_project(shortname: "fav#{SecureRandom.hex(2)}b")

    assert_nil ProjectSerializer.new(project).as_json[:favicon_url]
  end

  test "includes the raw display shortname in project payloads" do
    project = DataHelper.test_project(
      shortname: "dsp#{SecureRandom.hex(2)}a",
      display_shortname: 'Display label'
    )

    [ProjectSerializer, ProjectBaseSerializer, ProjectArchiveSerializer].each do |serializer|
      assert_equal 'Display label', serializer.new(project).as_json[:display_shortname]
    end
  end

  test "identifies configured umbrella project without legacy compatibility flag" do
    project = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a")
    InstanceSetting.current.update!(umbrella_project: project)

    [ProjectSerializer, ProjectBaseSerializer].each do |serializer|
      payload = serializer.new(project).as_json

      assert payload[:is_umbrella]
      assert_not payload.key?(:is_ohd)
      assert_not serializer.new(Project.find_by!(shortname: 'ohd')).as_json[:is_umbrella]
    end
  end
end
