require 'test_helper'
require 'minitest/mock'
require_relative '../../../support/api_schema_assertions'

# Checks optional registration settings, target-project authorization, and cache freshness.
class Api::V2::ProjectAccessConfigTest < ActionDispatch::IntegrationTest
  include ApiSchemaAssertions

  setup do
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
    host! 'test.portal.oral-history.localhost:47001'
    @project = DataHelper.test_project(shortname: "access#{SecureRandom.hex(2)}a")
    @config = @project.access_config
  end

  teardown do
    Rails.cache = @previous_cache
  end

  test 'default display exposes runtime settings without querying access configuration' do
    queries = config_queries do
      detail = read_project
      assert_equal @project.view_modes, detail['view_modes']
      assert_equal @project.default_search_order, detail['default_search_order']
      assert_equal [16, 9], detail.values_at('aspect_x', 'aspect_y')
      assert_not detail.key?('access_config')
      assert_not detail.key?('root_registry_entry_id')
      read_project
    end
    assert_empty queries
    @project.update_columns(view_modes: ['list'], default_search_order: 'archive_id', aspect_x: 4, aspect_y: 3)
    detail = read_project
    assert_equal ['list'], detail['view_modes']
    assert_equal 'archive_id', detail['default_search_order']
    assert_equal [4, 3], detail.values_at('aspect_x', 'aspect_y')
  end

  test 'display include returns only normalized allowlisted registration settings' do
    @config.update_columns(organization: { 'display' => 'TRUE', 'obligatory' => nil, 'answer' => 'Private answer' },
      job_description: { display: false, obligatory: 'false', values: { 'researcher' => 'true', 'student' => nil, 'unknown' => true } })
    settings = read_project(include: 'access_config')['access_config']
    assert_equal %w[job_description organization research_intentions specification tos_agreement], settings.keys.sort
    assert_equal({ 'display' => true, 'obligatory' => false }, settings['organization'])
    assert_equal false, settings['job_description']['display']
    assert_equal false, settings['job_description']['obligatory']
    assert_equal true, settings['job_description']['values']['researcher']
    assert_equal false, settings['job_description']['values']['student']
    assert_not settings['job_description']['values'].key?('unknown')
    assert_not settings.key?('id')
    assert_not settings.key?('project_id')
  end

  test 'included cache refreshes after edits deletion creation and project reassignment without timestamps' do
    assert_equal true, read_project(include: 'access_config')['access_config']['organization']['display']
    @config.update_column(:organization, { display: false, obligatory: true })
    assert_equal false, read_project(include: 'access_config')['access_config']['organization']['display']
    @config.destroy!
    assert_nil read_project(include: 'access_config')['access_config']
    replacement = AccessConfig.create!(project: @project)
    assert_equal true, read_project(include: 'access_config')['access_config']['organization']['display']
    replacement.update_column(:project_id, Project.find_by!(shortname: 'test').id)
    assert_nil read_project(include: 'access_config')['access_config']
  end

  test 'omitted configuration does not invalidate default cache and normalized includes reuse cached data' do
    default = read_project
    included = read_project(include: 'access_config')
    @config.update_column(:organization, { display: false })
    Api::V2::ProjectDisplaySerializer.stub(:new, ->(*) { flunk 'Default cache must ignore access configuration' }) do
      assert_equal default, read_project
    end
    refreshed = read_project(include: 'access_config')
    assert_not_equal included['access_config'], refreshed['access_config']
    Api::V2::ProjectDisplaySerializer.stub(:new, ->(*) { flunk 'Normalized includes must share cached data' }) do
      assert_equal refreshed, read_project(include: ' access_config,access_config ')
    end
  end

  test 'edit identifier requires target project update permission and includes remain detail only' do
    read_project
    read_project(profile: 'edit', include: 'access_config', expected: :forbidden)
    user = User.find_by!(email: 'john@example.com')
    role = Role.create!(project: @project, name: 'Access editor')
    permission = Permission.find_or_create_by!(klass: 'Project', action_name: 'update')
    RolePermission.create!(role: role, permission: permission)
    grant = UserRole.create!(user: user, role: role)
    sign_in user, scope: :user
    settings = read_project(profile: 'edit', include: 'access_config')['access_config']
    assert_equal @config.id, settings['id']
    assert_not read_project(include: 'access_config')['access_config'].key?('id')
    grant.destroy!
    read_project(profile: 'edit', include: 'access_config', expected: :forbidden)
    @project.update_column(:workflow_state, 'unshared')
    read_project(include: 'access_config', expected: :forbidden)
    host! 'another.oral-history.localhost:47001'
    read_project(include: 'access_config', expected: :forbidden)
    get '/api/v2/projects', params: { include: 'access_config' }
    assert_response :bad_request
    assert_api_response_schema('/api/v2/projects')
  end

  private

  # Reads and validates a target project response from the selected profile.
  #
  # @param expected [Symbol] Expected HTTP response status
  # @param parameters [Hash] Detail query parameters
  # @return [Hash, nil] Project data, or nil for an error response
  def read_project(expected: :success, **parameters)
    get "/api/v2/projects/#{@project.id}", params: { locale: 'en', **parameters }
    assert_response expected
    assert_api_response_schema('/api/v2/projects/{identifier}',
      data_schema: request.query_parameters['profile'] == 'edit' ? 'ProjectEdit' : 'ProjectDisplay')
    JSON.parse(response.body)['data']
  end

  # Captures access-configuration reads, including cache fingerprint queries.
  #
  # @yield Performs API requests to inspect
  # @return [Array<String>] SQL queries that read access configurations
  def config_queries
    queries = []
    subscriber = ->(*event) { queries << event.last[:sql] if event.last[:sql].match?(/FROM [`"]?access_configs[`"]?/i) }
    ActiveSupport::Notifications.subscribed(subscriber, 'sql.active_record') { yield }
    queries
  end
end
