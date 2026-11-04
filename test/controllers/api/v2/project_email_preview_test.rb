require 'test_helper'
require 'minitest/mock'
require_relative '../../../support/api_schema_assertions'

# Checks email-preview permissions, project isolation, and optional cached contact data.
class Api::V2::ProjectEmailPreviewTest < ActionDispatch::IntegrationTest
  include ApiSchemaAssertions

  setup do
    Rails.application.reload_routes! if Devise.mappings.empty?
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
    host! 'test.portal.oral-history.localhost:47001'
    @project = DataHelper.test_project(shortname: "mail#{SecureRandom.hex(2)}a", contact_email: 'contact@example.org')
    @user = User.find_by!(email: 'john@example.com')
    @role = Role.create!(project: @project, name: 'Project user manager')
    @permission = Permission.find_or_create_by!(klass: 'UserProject', action_name: 'update')
    @role_permission = RolePermission.create!(role: @role, permission: @permission)
    UserRole.create!(user: @user, role: @role)
  end

  teardown do
    Rails.cache = @previous_cache
  end

  test 'managers can preview without project edit access and editors and admins retain access' do
    @project.update_column(:workflow_state, 'unshared')
    sign_in @user, scope: :user
    assert_equal 'contact@example.org', read_project['contact_email']
    read_project(profile: 'edit', expected: :forbidden)
    @role_permission.destroy!
    RolePermission.create!(role: @role, permission: Permission.find_or_create_by!(klass: 'Project', action_name: 'update'))
    assert_equal 'contact@example.org', read_project['contact_email']
    assert_equal 'contact@example.org', read_project(profile: 'edit')['contact_email']
    delete '/en/users/sign_out'
    assert_response :redirect
    sign_in User.find_by!(email: 'alice@example.com'), scope: :user
    assert_equal 'contact@example.org', read_project['contact_email']
  end

  test 'anonymous users own memberships unrelated managers and revoked permissions cannot read cached previews' do
    read_project(expected: :forbidden)
    sign_in @user, scope: :user
    assert_equal 'contact@example.org', read_project['contact_email']
    @role.update!(project: Project.find_by!(shortname: 'test'))
    membership = UserProject.create!(user: @user, project: @project)
    membership.update_column(:workflow_state, 'project_access_granted')
    read_project(expected: :forbidden)
    @role.update!(project: @project)
    assert_equal 'contact@example.org', read_project['contact_email']
    @role_permission.destroy!
    read_project(expected: :forbidden)
    RolePermission.create!(role: @role, permission: @permission)
    read_project
    delete '/en/users/sign_out'
    assert_response :redirect
    read_project(expected: :forbidden)
  end

  test 'contact data is optional and cache follows changes without invalidating ordinary display details' do
    default = read_project(include: nil)
    assert_not default.key?('contact_email')
    sign_in @user, scope: :user
    default = read_project(include: nil)
    assert_equal default.merge('contact_email' => 'contact@example.org'), read_project
    Api::V2::ProjectDisplaySerializer.stub(:new, ->(*) { flunk 'Equivalent includes must reuse the cached preview' }) do
      assert_equal 'contact@example.org', read_project(include: ' email_preview,email_preview ')['contact_email']
    end
    @project.update_column(:contact_email, 'changed@example.org')
    assert_equal 'changed@example.org', read_project['contact_email']
    @project.update_column(:contact_email, nil)
    assert_nil read_project['contact_email']
    Api::V2::ProjectDisplaySerializer.stub(:new, ->(*) { flunk 'Contact edits must not invalidate ordinary display details' }) do
      assert_equal default, read_project(include: nil)
    end
    get '/api/v2/projects', params: { include: 'email_preview' }
    assert_response :bad_request
    assert_api_response_schema('/api/v2/projects')
  end

  private

  # Reads email-preview settings and validates the requested response profile.
  #
  # @param include [String, nil] Optional fields to request, or nil to omit includes
  # @param profile [String] Display or edit representation
  # @param expected [Symbol] Expected HTTP status
  # @return [Hash, nil] Project fields, or nil for an error response
  def read_project(include: 'email_preview', profile: 'display', expected: :success)
    get "/api/v2/projects/#{@project.shortname}", params: { include: include, profile: profile }.compact
    assert_response expected
    assert_api_response_schema('/api/v2/projects/{identifier}',
      data_schema: profile == 'edit' ? 'ProjectEdit' : 'ProjectDisplay')
    JSON.parse(response.body)['data']
  end
end
