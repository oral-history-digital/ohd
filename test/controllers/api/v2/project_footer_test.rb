require 'test_helper'
require 'minitest/mock'
require_relative '../../../support/api_schema_assertions'

# Checks the footer's display projection, cache dependencies, and project access.
class Api::V2::ProjectFooterTest < ActionDispatch::IntegrationTest
  include ApiSchemaAssertions

  setup do
    Rails.application.reload_routes! if Devise.mappings.empty?
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
    host! 'test.portal.oral-history.localhost:47001'
    @project = DataHelper.test_project(shortname: "foot#{SecureRandom.hex(2)}a", default_locale: 'de')
    @link = ExternalLink.create!(project: @project, internal_name: 'Editor label')
    @link.translations.create!(locale: 'en', name: 'English link', url: 'https://example.org/en')
    @link.translations.create!(locale: 'de', name: 'Deutscher Link', url: 'https://example.org/de')
    @logo = create_logo
  end

  teardown do
    Rails.cache = @previous_cache
  end

  test 'footer is optional and returns localized links and attached logos for the requested locale only' do
    queries = []
    subscriber = ->(*event) do
      sql = event.last[:sql]
      queries << sql if sql.match?(/FROM [`"]?external_links[`"]?|SponsorLogo/i)
    end
    ActiveSupport::Notifications.subscribed(subscriber, 'sql.active_record') do
      2.times do
        data = read_project(include: nil)
        assert_not data.key?('external_links')
        assert_not data.key?('sponsor_logos')
      end
    end
    assert_empty queries
    german = create_logo(locale: 'de')
    data = read_project
    assert_equal [{ 'id' => @link.id, 'name' => 'English link', 'url' => 'https://example.org/en' }], data['external_links']
    assert_equal [@logo.id], data['sponsor_logos'].map { |logo| logo['id'] }
    assert_equal %w[href id locale title url], data['sponsor_logos'].first.keys.sort
    assert_equal ['https://sponsor.example.org', 'Sponsor'], data['sponsor_logos'].first.values_at('href', 'title')
    assert_match @logo.file.filename.to_s, data['sponsor_logos'].first['url']
    assert_equal [german.id], read_project(locale: 'de')['sponsor_logos'].map { |logo| logo['id'] }
    fallback = read_project(locale: 'ar')
    assert_equal 'Deutscher Link', fallback['external_links'].first['name']
    assert_empty fallback['sponsor_logos']
    get '/api/v2/projects', params: { include: 'footer' }
    assert_response :bad_request
  end

  test 'cache follows link and image edits replacements locale changes and deletions while default stays cached' do
    default = read_project(include: nil)
    read_project
    @link.translations.find_by!(locale: 'en').update_columns(name: '', url: 'https://example.org/updated')
    link = read_project['external_links'].first
    assert_equal 'Deutscher Link', link['name']
    assert_equal 'https://example.org/updated', link['url']
    @logo.update_columns(title: 'Changed title', href: 'https://sponsor.example.org/new')
    assert_equal ['Changed title', 'https://sponsor.example.org/new'], read_project['sponsor_logos'].first.values_at('title', 'href')
    @logo.file.blob.update_column(:filename, 'renamed-footer.png')
    assert_match 'renamed-footer.png', read_project['sponsor_logos'].first['url']
    @logo.file.attach(io: StringIO.new('replacement'), filename: 'replacement-footer.png', content_type: 'image/png')
    assert_match 'replacement-footer.png', read_project['sponsor_logos'].first['url']
    @logo.update_column(:locale, 'de')
    assert_empty read_project['sponsor_logos']
    @logo.update_column(:locale, 'en')
    @logo.file.detach
    assert_empty read_project['sponsor_logos']
    @link.destroy!
    assert_empty read_project['external_links']
    Api::V2::ProjectDisplaySerializer.stub(:new, ->(*) { flunk 'Omitted footer must keep its cached response' }) do
      assert_equal default, read_project(include: nil)
    end
  end

  test 'footer stays scoped to the target project and cached responses respect access revocation' do
    read_project
    other_id = Project.find_by!(shortname: 'test').id
    @link.update_column(:project_id, other_id)
    @logo.update_column(:ref_id, other_id)
    assert_empty read_project['external_links']
    assert_empty read_project['sponsor_logos']
    @project.update_column(:workflow_state, 'unshared')
    read_project(expected: :forbidden)
    user = User.find_by!(email: 'john@example.com')
    role = Role.create!(project_id: @project.id, name: 'Footer reader')
    grant = UserRole.create!(user: user, role: role)
    sign_in user, scope: :user
    assert_empty read_project['external_links']
    read_project(profile: 'edit', expected: :forbidden)
    permission = Permission.find_or_create_by!(klass: 'Project', action_name: 'update')
    RolePermission.create!(role: role, permission: permission)
    assert_empty read_project(profile: 'edit')['sponsor_logos']
    grant.destroy!
    read_project(expected: :forbidden)
    read_project(profile: 'edit', expected: :forbidden)
  end

  private

  # Creates an attached sponsor image for a project locale.
  #
  # @param locale [String] Image locale
  # @return [SponsorLogo] Persisted sponsor image
  def create_logo(locale: 'en')
    logo = SponsorLogo.new(ref_type: 'Project', ref_id: @project.id, locale: locale,
      href: 'https://sponsor.example.org', title: 'Sponsor')
    logo.file.attach(io: StringIO.new('image'), filename: "footer-#{SecureRandom.hex(3)}.png", content_type: 'image/png')
    logo.save!
    logo
  end

  # Reads and validates the footer display projection from either profile.
  #
  # @param include [String, nil] Include parameter, or nil to omit it
  # @param expected [Symbol] Expected response status
  # @param parameters [Hash] Additional query parameters
  # @return [Hash, nil] Project data, or nil for errors
  def read_project(include: 'footer', expected: :success, **parameters)
    get "/api/v2/projects/#{@project.id}", params: { locale: 'en', include: include, **parameters }.compact
    assert_response expected
    assert_api_response_schema('/api/v2/projects/{identifier}',
      data_schema: request.query_parameters['profile'] == 'edit' ? 'ProjectEdit' : 'ProjectDisplay')
    JSON.parse(response.body)['data']
  end
end
