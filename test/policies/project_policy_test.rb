require "test_helper"

class ProjectPolicyTest < ActiveSupport::TestCase
  def setup
    @project = Project.find_by(shortname: "test")
    @admin = User.find_by(email: "alice@example.com")
    @user = User.find_by(email: "john@example.com")
    @context = ProjectContext.new(@user, @project)
  end

  # Regression test: serializing projects/:id.json checks the update?
  # permission for a Project record, which routes through
  # User#task_permissions?. Project has no interview_id, so this used to
  # raise NoMethodError. It must instead resolve to a plain permission check.
  test "update? on a Project record does not raise for a non-admin user" do
    assert_nothing_raised do
      ProjectPolicy.new(@context, @project).update?
    end
  end

  test "update? on a Project record is denied for a non-admin without roles" do
    assert_not ProjectPolicy.new(@context, @project).update?
  end

  test "update? on a Project record is granted for an admin" do
    admin_context = ProjectContext.new(@admin, @project)
    assert ProjectPolicy.new(admin_context, @project).update?
  end

  # task_permissions? is the method that crashed; guard it directly for any
  # record that neither is an Interview nor responds to interview_id.
  test "task_permissions? returns nil for a record without interview_id" do
    assert_nil @user.task_permissions?(@project, @project, "update")
  end
end
