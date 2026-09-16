require 'test_helper'

class UserPolicyTest < ActiveSupport::TestCase
  # Regular and namespaced admin controllers use different policies. Both must
  # distinguish instance-wide umbrella access from archive-scoped access.
  setup do
    # Keep 'ohd' as an ordinary archive to catch shortname-based role checks.
    @umbrella = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a")
    InstanceSetting.current.update!(umbrella_project: @umbrella)
    @archive = Project.find_by!(shortname: 'ohd')
    @admin = User.find_by!(email: 'alice@example.com')
    @member = User.find_by!(email: 'john@example.com')
    # Only the member belongs to this archive. The superuser does not, allowing
    # us to verify that even a superuser's archive listing remains scoped.
    UserProject.create!(user: @member, project: @archive)
  end

  test 'both admin scopes use configured umbrella for global user visibility' do
    [UserPolicy::Scope, Admin::UserPolicy::Scope].each do |scope_class|
      assert_includes scope_class.new(ProjectContext.new(@admin, @umbrella), User).resolve, @admin
      assert_includes scope_class.new(ProjectContext.new(@admin, @umbrella), User).resolve, @member

      archive_users = scope_class.new(ProjectContext.new(@admin, @archive), User).resolve
      assert_includes archive_users, @member
      assert_not_includes archive_users, @admin
    end
  end

  test 'both role-authorized scopes preserve archive isolation' do
    permission = Permission.find_or_create_by!(klass: 'User', action_name: 'update')
    # Authorize the non-superuser in both contexts. Admin::UserPolicy checks
    # the project-specific role, while UserPolicy checks User permissions.
    [@umbrella, @archive].each do |project|
      role = Role.create!(project: project, name: 'User manager', permissions: [permission])
      UserRole.create!(user: @member, role: role)
    end

    [UserPolicy::Scope, Admin::UserPolicy::Scope].each do |scope_class|
      assert_includes scope_class.new(ProjectContext.new(@member, @umbrella), User).resolve, @admin
      archive_users = scope_class.new(ProjectContext.new(@member, @archive), User).resolve
      assert_includes archive_users, @member
      assert_not_includes archive_users, @admin
    end
  end

  test 'both scopes deny users without permission and anonymous users' do
    # Archive membership alone grants no user-management permission. This test
    # has no manager roles; transactional tests roll back the roles above.
    [UserPolicy::Scope, Admin::UserPolicy::Scope].each do |scope_class|
      [@umbrella, @archive].each do |project|
        [@member, nil].each do |user|
          assert_empty scope_class.new(ProjectContext.new(user, project), User).resolve
        end
      end
    end
  end
end
