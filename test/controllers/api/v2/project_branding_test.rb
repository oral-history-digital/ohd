require 'test_helper'
require 'minitest/mock'
require_relative '../../../support/api_schema_assertions'

# Checks editable images without duplicating general detail and footer coverage.
class Api::V2::ProjectBrandingTest < ActionDispatch::IntegrationTest
  include ApiSchemaAssertions

  setup do
    Rails.application.reload_routes! if Devise.mappings.empty?
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
    host! 'test.portal.oral-history.localhost:47001'
    @project = DataHelper.test_project(shortname: "brand#{SecureRandom.hex(2)}a")
    @logo = create_image(Logo, locale: 'en')
    @sponsor = create_image(SponsorLogo, locale: 'de')
    @user = User.find_by!(email: 'john@example.com')
    @role = Role.create!(project: @project, name: 'Branding editor')
    @grant = UserRole.create!(role: @role, user: @user)
    @permissions = %w[Project Logo SponsorLogo].to_h do |klass|
      permission = Permission.find_or_create_by!(klass: klass, action_name: 'update')
      [klass, RolePermission.create!(role: @role, permission: permission)]
    end
    sign_in @user, scope: :user
  end

  teardown do
    Rails.cache = @previous_cache
  end

  test 'branding includes all locales and unattached records while footer only keeps its display projection' do
    missing = create_image(SponsorLogo, locale: nil)
    missing.file.detach
    data = read_project
    assert_equal [@logo.id], data['logos'].map { |image| image['id'] }
    assert_equal [@sponsor.id, missing.id], data['sponsor_logos'].map { |image| image['id'] }
    assert_equal ['SponsorLogo', 'de', 'Sponsor', 'https://sponsor.example.org'],
      data['sponsor_logos'].first.values_at('type', 'locale', 'title', 'href')
    assert_equal @logo.file.filename.to_s, data['logos'].first['filename']
    assert_match @logo.file.filename.to_s, data['logos'].first['url']
    assert_equal [nil, nil, nil], data['sponsor_logos'].last.values_at('locale', 'url', 'filename')
    combined = read_project(include: 'footer,branding')
    assert_equal data['sponsor_logos'], combined['sponsor_logos']
    assert_equal data['logos'], combined['logos']
    assert_empty combined['external_links']
    footer = read_project(include: 'footer')
    assert_empty footer['sponsor_logos']
    assert_not footer.key?('logos')
    assert_not read_project(include: nil).key?('sponsor_logos')
  end

  test 'branding cache follows image fields attachments and project ownership' do
    read_project
    @logo.update_columns(href: 'https://example.org/new', title: 'Changed logo')
    assert_equal ['https://example.org/new', 'Changed logo'], read_project['logos'].first.values_at('href', 'title')
    @logo.file.blob.update_column(:filename, 'renamed-brand.png')
    assert_equal 'renamed-brand.png', read_project['logos'].first['filename']
    @sponsor.file.attach(io: StringIO.new('replacement'), filename: 'replacement-brand.png', content_type: 'image/png')
    assert_equal 'replacement-brand.png', read_project['sponsor_logos'].first['filename']
    @sponsor.update_columns(locale: 'en', href: 'https://example.org/sponsor', title: 'Changed sponsor')
    assert_equal ['en', 'https://example.org/sponsor', 'Changed sponsor'], read_project['sponsor_logos'].first.values_at('locale', 'href', 'title')
    @sponsor.update_column(:ref_id, Project.find_by!(shortname: 'test').id)
    assert_empty read_project['sponsor_logos']
    @sponsor.update_columns(ref_id: @project.id, ref_type: 'Interview')
    assert_empty read_project['sponsor_logos']
    @sponsor.update_column(:ref_type, 'Project')
    assert_equal @sponsor.id, read_project['sponsor_logos'].first['id']
    @sponsor.destroy!
    assert_empty read_project['sponsor_logos']
    @logo.file.detach
    assert_nil read_project['logos'].first['url']
  end

  test 'branding is edit only and resource and project revocation block cached responses' do
    read_project
    read_project(profile: 'display', expected: :bad_request)
    @permissions.fetch('SponsorLogo').destroy!
    read_project(expected: :forbidden)
    @permissions.fetch('Logo').destroy!
    read_project(expected: :forbidden)
    assert_empty read_project(profile: 'display', include: 'footer')['sponsor_logos']
    @project.update_column(:workflow_state, 'unshared')
    @grant.destroy!
    read_project(expected: :forbidden)
    read_project(profile: 'display', include: 'footer', expected: :forbidden)
  end

  private

  # Creates an attached project image with the existing upload model.
  #
  # @param klass [Class] Logo or SponsorLogo
  # @param locale [String, nil] Stored image locale
  # @return [UploadedFile] Persisted image
  def create_image(klass, locale:)
    image = klass.new(ref_type: 'Project', ref_id: @project.id, locale: locale,
      title: 'Sponsor', href: 'https://sponsor.example.org')
    image.file.attach(io: StringIO.new('image'), filename: "brand-#{SecureRandom.hex(3)}.png", content_type: 'image/png')
    image.save!
    image
  end

  # Reads and validates the selected project image representation.
  #
  # @param expected [Symbol] Expected response status
  # @param parameters [Hash] Query parameters, overriding edit branding defaults
  # @return [Hash, nil] Project data, or nil for errors
  def read_project(expected: :success, **parameters)
    get "/api/v2/projects/#{@project.id}", params: { locale: 'en', profile: 'edit', include: 'branding', **parameters }.compact
    assert_response expected
    assert_api_response_schema('/api/v2/projects/{identifier}')
    JSON.parse(response.body)['data']
  end
end
