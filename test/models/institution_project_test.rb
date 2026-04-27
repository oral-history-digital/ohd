require "test_helper"

class InstitutionProjectTest < ActiveSupport::TestCase
  def setup
    @project = DataHelper.test_project(shortname: "lp#{SecureRandom.hex(2)}a")

    @parent_institution = Institution.create!(
      name: "Institution Parent",
      shortname: "ipa#{SecureRandom.hex(2)}a"
    )

    @child_institution = Institution.create!(
      name: "Institution Child",
      shortname: "ich#{SecureRandom.hex(2)}a",
      parent: @parent_institution
    )

    collection = Collection.create!(name: "InstitutionProject Collection", project: @project)
    Interview.create!(
      project: @project,
      collection: collection,
      archive_id: "#{@project.shortname}001",
      media_type: "video",
      workflow_state: "public"
    )

    @project.update_interviews_count
  end

  test "create and destroy updates institution project and interview counters" do
    assert_equal 0, @child_institution.reload.projects_count
    assert_equal 0, @parent_institution.reload.projects_count

    link = InstitutionProject.create!(institution: @child_institution, project: @project)

    assert_equal 1, @child_institution.reload.projects_count
    assert_equal 1, @parent_institution.reload.projects_count
    assert_equal 1, @child_institution.reload.interviews_count
    assert_equal 1, @parent_institution.reload.interviews_count

    link.destroy!

    assert_equal 0, @child_institution.reload.projects_count
    assert_equal 0, @parent_institution.reload.projects_count
    assert_equal 0, @child_institution.reload.interviews_count
    assert_equal 0, @parent_institution.reload.interviews_count
  end
end
