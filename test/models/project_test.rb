require "test_helper"

class ProjectTest < ActiveSupport::TestCase
  def setup
    @project = DataHelper.test_project(shortname: "prj#{SecureRandom.hex(2)}a")

    @parent_institution = Institution.create!(
      name: "Parent Institution",
      shortname: "par#{SecureRandom.hex(2)}a"
    )

    @child_institution = Institution.create!(
      name: "Child Institution",
      shortname: "chi#{SecureRandom.hex(2)}a",
      parent: @parent_institution,
      projects: [@project]
    )

    collection = Collection.create!(name: "Project Test Collection", project: @project)
    Interview.create!(
      project: @project,
      collection: collection,
      archive_id: "#{@project.shortname}001",
      media_type: "video",
      workflow_state: "public"
    )

    @project.update_interviews_count
    @child_institution.update_projects_count
    @parent_institution.update_projects_count
    @child_institution.update_interviews_count
    @parent_institution.update_interviews_count
  end

  test "workflow_state change refreshes institution counters and timestamps" do
    assert_equal 1, @project.reload.interviews_count
    assert_equal 1, @child_institution.reload.projects_count
    assert_equal 1, @parent_institution.reload.projects_count
    assert_equal 1, @child_institution.reload.interviews_count
    assert_equal 1, @parent_institution.reload.interviews_count

    @child_institution.update_column(:updated_at, 2.days.ago)
    @parent_institution.update_column(:updated_at, 2.days.ago)

    @project.update!(workflow_state: "unshared")

    assert_equal 0, @child_institution.reload.projects_count
    assert_equal 0, @parent_institution.reload.projects_count
    assert_equal 0, @child_institution.reload.interviews_count
    assert_equal 0, @parent_institution.reload.interviews_count
    assert_operator @child_institution.updated_at, :>, 1.day.ago
    assert_operator @parent_institution.updated_at, :>, 1.day.ago
  end

  test "accepts PNG and icon favicons up to one megabyte" do
    @project.favicon.attach(
      io: StringIO.new("favicon"),
      filename: "favicon.png",
      content_type: "image/png"
    )

    assert @project.valid?
  end

  test "rejects unsupported favicon types" do
    @project.favicon.attach(
      io: StringIO.new("not an image"),
      filename: "favicon.txt",
      content_type: "text/plain"
    )

    assert_not @project.valid?
    assert @project.errors.added?(:favicon, :invalid_content_type)
  end

  test "rejects favicons larger than one megabyte" do
    @project.favicon.attach(
      io: StringIO.new("x" * (1.megabyte + 1)),
      filename: "favicon.png",
      content_type: "image/png"
    )

    assert_not @project.valid?
    assert @project.errors.added?(:favicon, :file_too_large)
  end

  test "identifies umbrella project from instance settings" do
    umbrella_project = DataHelper.test_project(
      shortname: "umb#{SecureRandom.hex(2)}a"
    )
    InstanceSetting.current.update!(umbrella_project: umbrella_project)

    assert_equal umbrella_project, Project.umbrella
    assert_equal umbrella_project, Project.ohd
    assert umbrella_project.umbrella?
    assert umbrella_project.is_ohd?
    assert_not @project.umbrella?
    assert_not @project.is_ohd?

    ohd_project = Project.find_by!(shortname: "ohd")
    assert_not ohd_project.umbrella?
    assert_not ohd_project.is_ohd?
  end

  test "combines configured umbrella and project search facets" do
    umbrella_project = DataHelper.test_project(
      shortname: "umb#{SecureRandom.hex(2)}a"
    )
    InstanceSetting.current.update!(umbrella_project: umbrella_project)

    umbrella_facet = MetadataField.create!(
      project: umbrella_project,
      source: "Interview",
      name: "umbrella_facet",
      use_as_facet: true,
      facet_order: 1
    )
    project_facet = MetadataField.create!(
      project: @project,
      source: "Interview",
      name: "project_facet",
      use_as_facet: true,
      facet_order: 2
    )

    assert_equal [umbrella_facet, project_facet], @project.search_facets_including_umbrella
  end

  test "collection facets are global only for the configured umbrella" do
    umbrella = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a")
    InstanceSetting.current.update!(umbrella_project: umbrella)

    archive = Project.find_by!(shortname: "ohd")
    other_archive = DataHelper.test_project(shortname: "arc#{SecureRandom.hex(2)}a")
    hidden = DataHelper.test_project(shortname: "hid#{SecureRandom.hex(2)}a", workflow_state: "unshared")

    other_collection = Collection.create!(name: "Other archive collection", project: other_archive)
    archive_collection = Collection.create!(name: "Archive collection", project: archive)
    hidden_collection = Collection.create!(name: "Hidden collection", project: hidden)
    
    [umbrella, archive].each do |project|
      MetadataField.create!(project: project, source: "Interview", name: "collection_id", use_as_facet: true)
    end

    umbrella_ids = umbrella.search_facets_hash.fetch(:collection_id).fetch(:subfacets).keys
    assert_includes umbrella_ids, other_collection.id.to_s
    assert_includes umbrella_ids, archive_collection.id.to_s
    assert_not_includes umbrella_ids, hidden_collection.id.to_s

    archive_ids = archive.search_facets_hash.fetch(:collection_id).fetch(:subfacets).keys
    assert_equal [archive_collection.id.to_s], archive_ids
  end
end
