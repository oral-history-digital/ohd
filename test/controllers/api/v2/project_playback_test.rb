require 'test_helper'
require 'minitest/mock'
require_relative '../../../support/api_schema_assertions'

# Checks playback projections, optional query work, access, and cache freshness.
class Api::V2::ProjectPlaybackTest < ActionDispatch::IntegrationTest
  include ApiSchemaAssertions

  setup do
    Rails.application.reload_routes! if Devise.mappings.empty?
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
    host! 'test.portal.oral-history.localhost:47001'
    @project = DataHelper.test_project(shortname: "play#{SecureRandom.hex(2)}a", default_locale: 'de')
    @stream = MediaStream.create!(project: @project, media_type: 'video', resolution: 'hls',
      path: 'https://media.example.org/INTERVIEW_ID/TAPE_NUMBER.m3u8?token=example#fragment')
    @project.translations.find_or_initialize_by(locale: 'en').update!(media_missing_text: 'English message')
    @project.translations.find_or_initialize_by(locale: 'de').update!(media_missing_text: 'Deutsche Meldung')
  end

  teardown do
    Rails.cache = @previous_cache
  end

  test 'playback is optional and display returns only target stream descriptors and localized text' do
    queries = []
    subscriber = ->(*event) { queries << event.last[:sql] if event.last[:sql].match?(/FROM [`"]?media_streams[`"]?/i) }
    ActiveSupport::Notifications.subscribed(subscriber, 'sql.active_record') do
      2.times do
        data = read_project(include: nil)
        assert_not data.key?('media_streams')
        assert_not data.key?('media_missing_text')
      end
    end
    assert_empty queries
    other = MediaStream.create!(project_id: Project.find_by!(shortname: 'test').id, media_type: 'audio')
    still = MediaStream.create!(project_id: @project.id, media_type: 'still', path: '/still.jpg')
    data = read_project
    assert_equal [@stream.id, still.id], data['media_streams'].map { |stream| stream['id'] }
    assert_not_includes data['media_streams'].map { |stream| stream['id'] }, other.id
    assert_equal({ 'id' => @stream.id, 'media_type' => 'video', 'resolution' => 'hls', 'suffix' => 'm3u8' }, data['media_streams'].first)
    assert_equal 'jpg', data['media_streams'].last['suffix']
    assert_nil data['media_streams'].last['resolution']
    assert_equal 'English message', data['media_missing_text']
    assert_equal 'Deutsche Meldung', read_project(locale: 'ar')['media_missing_text']
    get '/api/v2/projects', params: { include: 'playback' }
    assert_response :bad_request
  end

  test 'cache follows stream and text changes without invalidating requests that omit playback' do
    default = read_project(include: nil)
    read_project
    @stream.update_columns(path: '/changed.mp4', resolution: '720p', media_type: 'audio')
    stream = read_project['media_streams'].first
    assert_equal ['mp4', '720p', 'audio'], stream.values_at('suffix', 'resolution', 'media_type')
    @project.translations.find_by!(locale: 'en').update_column(:media_missing_text, ' ')
    assert_equal 'Deutsche Meldung', read_project['media_missing_text']
    @project.translations.find_by!(locale: 'de').update_column(:media_missing_text, nil)
    assert_nil read_project['media_missing_text']
    @stream.update_column(:project_id, Project.find_by!(shortname: 'test').id)
    assert_empty read_project['media_streams']
    replacement = MediaStream.create!(project_id: @project.id, media_type: 'audio', path: nil)
    assert_nil read_project['media_streams'].first['suffix']
    replacement.destroy!
    assert_empty read_project['media_streams']
    Api::V2::ProjectDisplaySerializer.stub(:new, ->(*) { flunk 'Omitted playback must keep its cached response' }) do
      assert_equal default, read_project(include: nil)
    end
  end

  test 'path templates require both project and stream update permissions and revocation blocks cached reads' do
    assert_not read_project['media_streams'].first.key?('path')
    read_project(profile: 'edit', expected: :forbidden)
    user = User.find_by!(email: 'john@example.com')
    role = Role.create!(project_id: @project.id, name: 'Playback editor')
    grant = UserRole.create!(user: user, role: role)
    project_permission = Permission.find_or_create_by!(klass: 'Project', action_name: 'update')
    RolePermission.create!(role: role, permission: project_permission)
    sign_in user, scope: :user
    read_project(profile: 'edit', expected: :forbidden)
    stream_permission = Permission.find_or_create_by!(klass: 'MediaStream', action_name: 'update')
    stream_grant = RolePermission.create!(role: role, permission: stream_permission)
    assert_equal @stream.path, read_project(profile: 'edit')['media_streams'].first['path']
    assert_not read_project['media_streams'].first.key?('path')
    stream_grant.destroy!
    read_project(profile: 'edit', expected: :forbidden)
    @project.update_column(:workflow_state, 'unshared')
    assert_equal @stream.id, read_project['media_streams'].first['id']
    grant.destroy!
    read_project(expected: :forbidden)
  end

  private

  # Reads and validates the requested playback projection.
  #
  # @param include [String, nil] Include parameter, or nil to omit it
  # @param expected [Symbol] Expected response status
  # @param parameters [Hash] Additional query parameters
  # @return [Hash, nil] Project data, or nil for errors
  def read_project(include: 'playback', expected: :success, **parameters)
    get "/api/v2/projects/#{@project.id}", params: { locale: 'en', include: include, **parameters }.compact
    assert_response expected
    assert_api_response_schema('/api/v2/projects/{identifier}',
      data_schema: request.query_parameters['profile'] == 'edit' ? 'ProjectEdit' : 'ProjectDisplay')
    JSON.parse(response.body)['data']
  end
end
