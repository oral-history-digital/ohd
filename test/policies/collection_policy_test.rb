require 'test_helper'

class CollectionPolicyTest < ActiveSupport::TestCase
  setup do
    @project = Project.find_by!(shortname: 'test')
    @user = User.find_by!(email: 'john@example.com')
    @collection = Collection.find_or_create_by!(
      project: @project,
      name: 'Collection policy test'
    )
  end

  test 'allows a non-admin with Collection update permission to update a collection' do
    permission = Permission.find_or_create_by!(
      klass: 'Collection',
      action_name: 'update'
    )
    role = Role.create!(project: @project, name: 'Collection editor')
    RolePermission.create!(role: role, permission: permission)
    UserRole.create!(user: @user, role: role)

    policy = CollectionPolicy.new(ProjectContext.new(@user, @project), @collection)

    assert policy.update?
  end

  test 'denies a non-admin without Collection update permission' do
    policy = CollectionPolicy.new(ProjectContext.new(@user, @project), @collection)

    assert_not policy.update?
  end
end
