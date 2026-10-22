require 'test_helper'
require 'minitest/mock'
require_relative '../../../support/api_schema_assertions'

# Checks optional form configuration, project access, and cache freshness.
class Api::V2::ProjectFormOptionsTest < ActionDispatch::IntegrationTest
  include ApiSchemaAssertions

  setup do
    Rails.application.reload_routes! if Devise.mappings.empty?
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
    host! 'test.portal.oral-history.localhost:47001'
    @project = DataHelper.test_project(shortname: "form#{SecureRandom.hex(2)}a",
      archive_id_number_length: 4, upload_types: ['bulk_metadata'])
  end

  teardown do
    Rails.cache = @previous_cache
  end

  test 'form options are optional and cached values follow edits without invalidating default details' do
    default = read_project(include: nil)
    %w[archive_id_number_length upload_types].each { |field| assert_not default.key?(field) }
    data = read_project
    assert_equal 4, data['archive_id_number_length']
    assert_equal ['bulk_metadata'], data['upload_types']
    Api::V2::ProjectDisplaySerializer.stub(:new, ->(*) { flunk 'Equivalent includes must reuse cached options' }) do
      assert_equal data, read_project(include: ' form_options,form_options ')
    end
    @project.update_column(:archive_id_number_length, 8)
    assert_equal 8, read_project['archive_id_number_length']
    @project.update_column(:upload_types, ['bulk_photos'])
    assert_equal ['bulk_photos'], read_project['upload_types']
    @project.update_columns(archive_id_number_length: nil, upload_types: [])
    data = read_project(include: 'registry_configuration,form_options')
    assert_nil data['archive_id_number_length']
    assert_empty data['upload_types']
    assert_equal @project.root_registry_entry.id, data['root_registry_entry_id']
    Api::V2::ProjectDisplaySerializer.stub(:new, ->(*) { flunk 'Omitted form options must keep their cached response' }) do
      assert_equal default, read_project(include: nil)
    end
    get '/api/v2/projects', params: { include: 'form_options' }
    assert_response :bad_request
    assert_api_response_schema('/api/v2/projects')
  end

  test 'form readers need target project access but not project update permission and revocation denies cached reads' do
    @project.update_column(:workflow_state, 'unshared')
    read_project(expected: :forbidden)
    user = User.find_by!(email: 'john@example.com')
    role = Role.create!(project: Project.find_by!(shortname: 'test'), name: 'Form editor')
    %w[Upload Interview].each do |klass|
      permission = Permission.find_or_create_by!(klass: klass, action_name: 'create')
      RolePermission.create!(role: role, permission: permission)
    end
    grant = UserRole.create!(user: user, role: role)
    sign_in user, scope: :user
    read_project(expected: :forbidden)
    role.update!(project: @project)
    assert_equal ['bulk_metadata'], read_project['upload_types']
    read_project(profile: 'edit', expected: :forbidden)
    grant.destroy!
    read_project(expected: :forbidden)
  end

  private

  # Reads project form options and validates the response for its requested profile.
  #
  # @param include [String, nil] Optional fields to request, or nil to omit includes
  # @param expected [Symbol] Expected HTTP status
  # @param profile [String] Display or edit profile
  # @return [Hash, nil] Project fields, or nil for an error response
  def read_project(include: 'form_options', expected: :success, profile: 'display')
    get "/api/v2/projects/#{@project.shortname}", params: { include: include, profile: profile }.compact
    assert_response expected
    assert_api_response_schema('/api/v2/projects/{identifier}',
      data_schema: profile == 'edit' ? 'ProjectEdit' : 'ProjectDisplay')
    JSON.parse(response.body)['data']
  end
end
