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
end