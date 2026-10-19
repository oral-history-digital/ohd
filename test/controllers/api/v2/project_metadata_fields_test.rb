require 'test_helper'
require 'minitest/mock'
require_relative '../../../support/api_schema_assertions'

# Checks optional metadata definitions, locale handling, access, and cache dependencies.
class Api::V2::ProjectMetadataFieldsTest < ActionDispatch::IntegrationTest
  include ApiSchemaAssertions

  setup do
    Rails.application.reload_routes! if Devise.mappings.empty?
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
    host! 'test.portal.oral-history.localhost:47001'
    @project = DataHelper.test_project(shortname: "meta#{SecureRandom.hex(2)}a", default_locale: 'de')
    @field = MetadataField.create!(project: @project, source: 'Interview', name: 'description',
      label: 'English label', locale: :en, use_in_results_table: true, use_in_results_list: false,
      use_in_details_view: true, use_in_metadata_import: true, list_columns_order: 2)
    @field.translations.find_or_initialize_by(locale: 'de').update!(label: 'Deutsches Label')
  end

  teardown do
    Rails.cache = @previous_cache
  end

  test 'default requests omit metadata and do not query its dependencies even on cache hits' do
    queries = metadata_queries do
      assert_not read_project.key?('metadata_fields')
      read_project
    end
    assert_empty queries
    cached = read_project
    @field.update_column(:name, 'changed')
    Api::V2::ProjectDisplaySerializer.stub(:new, ->(*) { flunk 'Omitted metadata must not invalidate the cache' }) do
      assert_equal cached, read_project
    end
    get '/api/v2/projects', params: { include: 'metadata_fields' }
    assert_response :bad_request
    assert_api_response_schema('/api/v2/projects')
  end

  test 'display returns scoped localized definitions and existing grid and list selection flags' do
    other = MetadataField.create!(project: Project.find_by!(shortname: 'test'), source: 'Interview', name: 'other_field')
    second = MetadataField.create!(project: @project, source: 'Person', name: 'gender',
      use_in_results_table: false, use_in_results_list: true, list_columns_order: 1)
    fields = read_project(include: 'metadata_fields')['metadata_fields']
    assert_equal [@field.id, second.id].sort, fields.map { |field| field['id'] }
    assert_not_includes fields.map { |field| field['id'] }, other.id
    assert_equal 'English label', fields.first['label']
    assert_equal true, fields.first['use_in_results_table']
    assert_equal false, fields.first['use_in_results_list']
    assert_equal false, fields.last['use_as_facet']
    assert_nil fields.last['label']
    %w[project_id values translations use_in_metadata_import registry_entries].each do |key|
      assert_not fields.first.key?(key)
    end
    assert_equal @project.grid_fields.map(&:id), fields.select { |field| field['use_in_results_table'] }
      .sort_by { |field| field['list_columns_order'] }.map { |field| field['id'] }
    assert_equal @project.list_columns.map(&:id), fields.select { |field| field['use_in_results_list'] }
      .sort_by { |field| field['list_columns_order'] }.map { |field| field['id'] }
    assert_equal 'Deutsches Label', read_project(include: 'metadata_fields', locale: 'ar')['metadata_fields'].first['label']
    @field.translations.find_by!(locale: 'en').update_column(:label, '')
    assert_equal 'Deutsches Label', read_project(include: 'metadata_fields')['metadata_fields'].first['label']
    @field.translations.find_by!(locale: 'de').delete
    @field.translations.create!(locale: 'ru', label: 'Russian label')
    assert_equal 'Russian label', read_project(include: 'metadata_fields')['metadata_fields'].first['label']
    assert_equal fields.map { |field| field['id'] }, read_project(identifier: @project.shortname,
      include: 'metadata_fields')['metadata_fields'].map { |field| field['id'] }
  end

  test 'reference IDs are returned without registry trees and queries do not grow per field' do
    entry = RegistryEntry.create!(project: @project, code: 'metadata_root', workflow_state: 'public')
    reference = RegistryReferenceType.create!(project: @project, registry_entry: entry, code: 'metadata_place')
    field = MetadataField.create!(project: @project, source: 'RegistryReferenceType', registry_reference_type: reference)
    initial = metadata_queries { read_project(include: 'metadata_fields') }
    data = read_project(include: 'metadata_fields')['metadata_fields'].find { |item| item['id'] == field.id }
    assert_equal reference.id, data['registry_reference_type_id']
    assert_equal entry.id, data['registry_entry_id']
    3.times { |i| MetadataField.create!(project_id: @project.id, source: 'Interview', name: "extra_#{i}") }
    expanded = metadata_queries { read_project(include: 'metadata_fields') }
    assert_equal initial.size, expanded.size
    assert_not expanded.any? { |sql| sql.match?(/FROM [`"]?registry_(entries|names|hierarchies)[`"]?/i) }
    reference.update_column(:registry_entry_id, nil)
    data = read_project(include: 'metadata_fields')['metadata_fields'].find { |item| item['id'] == field.id }
    assert_nil data['registry_entry_id']
  end

  test 'cache refreshes after field label creation deletion and project movement without timestamps' do
    read_project(include: 'metadata_fields')
    @field.update_columns(use_in_results_list: true, list_columns_order: 7, map_color: '#123456')
    data = read_project(include: 'metadata_fields')['metadata_fields'].first
    assert_equal true, data['use_in_results_list']
    assert_equal 7, data['list_columns_order']
    assert_equal '#123456', data['map_color']
    @field.translations.find_by!(locale: 'en').update_column(:label, 'Updated label')
    assert_equal 'Updated label', read_project(include: 'metadata_fields')['metadata_fields'].first['label']
    cached = read_project(include: 'metadata_fields')
    Api::V2::ProjectDisplaySerializer.stub(:new, ->(*) { flunk 'Equivalent includes must share the cache' }) do
      assert_equal cached, read_project(include: ' metadata_fields,metadata_fields ')
    end
    @field.update_column(:project_id, Project.find_by!(shortname: 'test').id)
    assert_empty read_project(include: 'metadata_fields')['metadata_fields']
    @field.update_column(:project_id, @project.id)
    assert_equal 1, read_project(include: 'metadata_fields')['metadata_fields'].size
    @field.destroy!
    assert_empty read_project(include: 'metadata_fields')['metadata_fields']
  end

  test 'edit adds stored labels and import settings only with target project update permission' do
    read_project(profile: 'edit', include: 'metadata_fields', expected: :forbidden)
    user = User.find_by!(email: 'john@example.com')
    role = Role.create!(project: @project, name: 'Metadata editor')
    permission = Permission.find_or_create_by!(klass: 'Project', action_name: 'update')
    RolePermission.create!(role: role, permission: permission)
    grant = UserRole.create!(user: user, role: role)
    sign_in user, scope: :user
    @field.translations.find_by!(locale: 'en').update_column(:label, '')
    data = read_project(profile: 'edit', include: 'metadata_fields')['metadata_fields'].first
    assert_equal 'Deutsches Label', data['label']
    assert_equal true, data['use_in_metadata_import']
    assert_equal @field.translations.order(:id).pluck(:id), data['translations'].map { |item| item['id'] }
    assert_equal '', data['translations'].find { |item| item['locale'] == 'en' }['label']
    @field.update_column(:use_in_metadata_import, nil)
    assert_equal false, read_project(profile: 'edit', include: 'metadata_fields')['metadata_fields'].first['use_in_metadata_import']
    @field.translations.find_by!(locale: 'de').update_column(:label, nil)
    data = read_project(profile: 'edit', include: 'metadata_fields')['metadata_fields'].first
    assert_nil data['label']
    assert_nil data['translations'].find { |item| item['locale'] == 'de' }['label']
    assert_not read_project(include: 'metadata_fields')['metadata_fields'].first.key?('translations')
    grant.destroy!
    read_project(profile: 'edit', include: 'metadata_fields', expected: :forbidden)
    @project.update_column(:workflow_state, 'unshared')
    read_project(include: 'metadata_fields', expected: :forbidden)
    host! 'another.oral-history.localhost:47001'
    read_project(include: 'metadata_fields', expected: :forbidden)
  end

  private

  # Reads and validates the selected project profile.
  #
  # @param identifier [Integer, String] Target ID or shortname
  # @param expected [Symbol] Expected response status
  # @param parameters [Hash] Query parameters
  # @return [Hash, nil] Project data, or nil for errors
  def read_project(identifier: @project.id, expected: :success, **parameters)
    get "/api/v2/projects/#{identifier}", params: { locale: 'en', **parameters }
    assert_response expected
    assert_api_response_schema('/api/v2/projects/{identifier}')
    JSON.parse(response.body)['data']
  end

  # Captures metadata and registry reads, including cache fingerprint queries.
  #
  # @yield Performs API requests to inspect
  # @return [Array<String>] Related SQL reads
  def metadata_queries
    queries = []
    subscriber = ->(*event) do
      sql = event.last[:sql]
      queries << sql if sql.match?(/FROM [`"]?(metadata_fields|metadata_field_translations|registry_reference_types|registry_entries|registry_names|registry_hierarchies)[`"]?/i)
    end
    ActiveSupport::Notifications.subscribed(subscriber, 'sql.active_record') { yield }
    queries
  end
end
