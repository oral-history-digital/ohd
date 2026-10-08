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

  test 'unshared visibility requires collection update permission in the owning project' do
    @project.update!(workflow_state: 'public')
    @collection.update!(workflow_state: 'unshared')
    other_project = DataHelper.test_project(shortname: "vis#{SecureRandom.hex(3)}a", workflow_state: 'public')
    permission = Permission.find_or_create_by!(klass: 'Collection', action_name: 'update')
    role = Role.create!(project: other_project, name: 'Other collection editor')
    RolePermission.create!(role: role, permission: permission)
    UserRole.create!(user: @user, role: role)

    [nil, @user].each do |user|
      context = ProjectContext.new(user, other_project)
      assert_not CollectionPolicy.new(context, @collection).show?
      assert_not CollectionPolicy::Scope.new(context, Collection).resolve.exists?(@collection.id)
    end

    role.update!(project: @project)
    context = ProjectContext.new(@user, other_project)
    assert CollectionPolicy.new(context, @collection).show?
    assert CollectionPolicy::Scope.new(context, Collection).resolve.exists?(@collection.id)

    admin_context = ProjectContext.new(User.find_by!(email: 'alice@example.com'), other_project)
    assert CollectionPolicy.new(admin_context, @collection).show?
    assert CollectionPolicy::Scope.new(admin_context, Collection).resolve.exists?(@collection.id)
  end

  test 'project read access does not expose unshared collections' do
    @project.update!(workflow_state: 'public')
    @collection.update!(workflow_state: 'unshared')
    permission = Permission.find_or_create_by!(klass: 'Collection', action_name: 'show')
    role = Role.create!(project: @project, name: 'Collection reader')
    RolePermission.create!(role: role, permission: permission)
    UserRole.create!(user: @user, role: role)
    context = ProjectContext.new(@user, @project)

    assert_not CollectionPolicy.new(context, @collection).show?
    assert_not CollectionPolicy::Scope.new(context, Collection).resolve.exists?(@collection.id)
    @collection.update!(workflow_state: 'public')
    assert CollectionPolicy.new(context, @collection).show?
    assert CollectionPolicy::Scope.new(context, Collection).resolve.exists?(@collection.id)
  end
end
