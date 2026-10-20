require 'test_helper'
require 'minitest/mock'
require_relative '../../../support/api_schema_assertions'

# Checks registry configuration without duplicating the general project-detail tests.
class Api::V2::ProjectRegistryConfigurationTest < ActionDispatch::IntegrationTest
  include ApiSchemaAssertions

  setup do
    Rails.application.reload_routes! if Devise.mappings.empty?
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
    host! 'test.portal.oral-history.localhost:47001'
    @project = DataHelper.test_project(shortname: "reg#{SecureRandom.hex(2)}a",
      logged_out_visible_registry_entry_ids: ['11'], hidden_registry_entry_ids: ['12'],
      hidden_transcript_registry_entry_ids: ['13'])
    @root = @project.root_registry_entry
  end

  teardown do
    Rails.cache = @previous_cache
  end

  test 'configuration is optional and public display includes transcript visibility settings when requested' do
    queries = []
    subscriber = ->(*event) { queries << event.last[:sql] if event.last[:sql].match?(/FROM [`"]?registry_entries[`"]?/i) }
    ActiveSupport::Notifications.subscribed(subscriber, 'sql.active_record') do
      2.times do
        data = read_project(include: nil)
        %w[root_registry_entry_id logged_out_visible_registry_entry_ids hidden_registry_entry_ids hidden_transcript_registry_entry_ids].each do |key|
          assert_not data.key?(key)
        end
      end
    end
    assert_empty queries
    data = read_project
    assert_equal @root.id, data['root_registry_entry_id']
    assert_equal ['11'], data['logged_out_visible_registry_entry_ids']
    assert_equal ['12'], data['hidden_registry_entry_ids']
    assert_equal ['13'], data['hidden_transcript_registry_entry_ids']
    get '/api/v2/projects', params: { include: 'registry_configuration' }
    assert_response :bad_request
  end

  test 'cache follows visibility edits and root creation removal and reassignment within the target project' do
    default = read_project(include: nil)
    read_project
    @project.update_columns(logged_out_visible_registry_entry_ids: [], hidden_registry_entry_ids: ['14'],
      hidden_transcript_registry_entry_ids: ['15'])
    data = read_project
    assert_empty data['logged_out_visible_registry_entry_ids']
    assert_equal ['14'], data['hidden_registry_entry_ids']
    assert_equal ['15'], data['hidden_transcript_registry_entry_ids']
    @root.update_column(:code, 'former_root')
    assert_nil read_project['root_registry_entry_id']
    replacement = RegistryEntry.create!(project_id: @project.id, code: 'root', workflow_state: 'public')
    assert_equal replacement.id, read_project['root_registry_entry_id']
    replacement.update_column(:project_id, Project.find_by!(shortname: 'test').id)
    assert_nil read_project['root_registry_entry_id']
    replacement.update_column(:project_id, @project.id)
    assert_equal replacement.id, read_project['root_registry_entry_id']
    replacement.destroy!
    assert_nil read_project['root_registry_entry_id']
    Api::V2::ProjectDisplaySerializer.stub(:new, ->(*) { flunk 'Omitted registry configuration must keep its cached response' }) do
      assert_equal default, read_project(include: nil)
    end
  end

  test 'member and editor reads use target project access and cached settings do not survive revocation' do
    @project.update_column(:workflow_state, 'unshared')
    read_project(expected: :forbidden)
    user = User.find_by!(email: 'john@example.com')
    role = Role.create!(project: @project, name: 'Registry member')
    grant = UserRole.create!(user: user, role: role)
    sign_in user, scope: :user
    data = read_project
    assert_equal @root.id, data['root_registry_entry_id']
    assert_equal ['13'], data['hidden_transcript_registry_entry_ids']
    read_project(profile: 'edit', expected: :forbidden)
    permission = Permission.find_or_create_by!(klass: 'Project', action_name: 'update')
    RolePermission.create!(role: role, permission: permission)
    data = read_project(profile: 'edit')
    assert_equal @root.id, data['root_registry_entry_id']
    assert_equal ['13'], data['hidden_transcript_registry_entry_ids']
    grant.destroy!
    read_project(expected: :forbidden)
    read_project(profile: 'edit', expected: :forbidden)
  end

  private

  # Reads and validates project details with optional registry configuration.
  #
  # @param include [String, nil] Include parameter, or nil to omit it
  # @param expected [Symbol] Expected response status
  # @param parameters [Hash] Additional query parameters
  # @return [Hash, nil] Project data, or nil for errors
  def read_project(include: 'registry_configuration', expected: :success, **parameters)
    get "/api/v2/projects/#{@project.id}", params: { include: include, **parameters }.compact
    assert_response expected
    assert_api_response_schema('/api/v2/projects/{identifier}',
      data_schema: request.query_parameters['profile'] == 'edit' ? 'ProjectEdit' : 'ProjectDisplay')
    JSON.parse(response.body)['data']
  end
end
