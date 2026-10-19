require 'test_helper'
require 'minitest/mock'
require_relative '../../../support/api_schema_assertions'

class Api::V2::ProjectEditTest < ActionDispatch::IntegrationTest
  include ApiSchemaAssertions
  CONTRACT_PATH = '/api/v2/projects/{identifier}'

  setup do
    # Load Devise's scope and session serializers before a first-request login.
    Rails.application.reload_routes! if Devise.mappings.empty?
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
    host! 'test.portal.oral-history.localhost:47001'
    @project = DataHelper.test_project(shortname: "edit#{SecureRandom.hex(3)}a", default_locale: 'de',
      contact_email: 'editor@example.org', view_modes: %w[grid list], upload_types: ['bulk_metadata'],
      logged_out_visible_registry_entry_ids: ['11'], hidden_registry_entry_ids: ['12'],
      hidden_transcript_registry_entry_ids: ['13'], pdf_registry_entry_ids: ['14'])
    @translation = @project.translations.find_or_initialize_by(locale: 'en')
    @translation.update!(name: 'English name', display_name: 'English display', introduction: '<p>Intro</p>',
      more_text: 'More', landing_page_text: 'Landing', restricted_landing_page_text: 'Restricted', media_missing_text: 'Missing')
    @project.translations.find_or_initialize_by(locale: 'de').update!(name: 'Deutscher Name')
    @user = User.find_by!(email: 'john@example.com')
    @role = Role.create!(project: @project, name: 'Project editor')
    @permission = Permission.find_or_create_by!(klass: 'Project', action_name: 'update')
    RolePermission.create!(role: @role, permission: @permission)
    @grant = UserRole.create!(user: @user, role: @role)
  end

  teardown do
    Rails.cache = @previous_cache
  end

  test 'edit extends display fields with typed settings and no legacy aliases or related records' do
    display = read_project(profile: 'display')
    edit = read_project
    assert_equal display, edit.slice(*display.keys)
    assert api_schema.schema('ProjectEdit').valid?(edit)
    assert_not api_schema.schema('ProjectDisplay').valid?(edit)
    assert_equal 'editor@example.org', edit['contact_email']
    assert_equal [16, 9], edit.values_at('aspect_x', 'aspect_y')
    %w[view_modes upload_types logged_out_visible_registry_entry_ids hidden_registry_entry_ids hidden_transcript_registry_entry_ids pdf_registry_entry_ids].each do |field|
      assert_equal @project.public_send(field), edit[field]
      assert_not edit.key?("pseudo_#{field}")
    end
    %w[translations access_config logos sponsor_logos institution_projects media_streams external_links cooperation_partners].each do |field|
      assert_not edit.key?(field)
    end
    @project.update_columns(fullname_on_landing_page: nil, show_preview_img: nil, show_legend: nil,
      aspect_x: nil, aspect_y: nil, archive_id_number_length: nil, contact_email: nil)
    edit = read_project
    %w[fullname_on_landing_page show_preview_img show_legend].each { |field| assert_equal false, edit[field] }
    %w[aspect_x aspect_y archive_id_number_length contact_email].each { |field| assert_nil edit[field] }
  end

  test 'translations return stored values and IDs across locales without fallback or unrelated records' do
    @translation.update_columns(name: '', introduction: nil, more_text: '  ')
    other = Project.find_by!(shortname: 'test')
    edit = read_project(include: 'translations', locale: 'ar')
    assert_equal 'Deutscher Name', edit['name']
    assert_equal 'ar', response.headers['Content-Language']
    assert_equal @project.translations.order(:id).pluck(:id), edit['translations'].map { |item| item['id'] }
    assert_empty edit['translations'].map { |item| item['id'] } & other.translations.pluck(:id)
    english = edit['translations'].find { |item| item['id'] == @translation.id }
    assert_equal %w[id locale name display_name introduction more_text landing_page_text restricted_landing_page_text media_missing_text].sort, english.keys.sort
    assert_equal '', english['name']
    assert_nil english['introduction']
    assert_equal '  ', english['more_text']
    assert_equal 'Restricted', english['restricted_landing_page_text']
    assert_equal 'Missing', english['media_missing_text']
    @project.translations.delete_all
    assert_equal [], read_project(include: 'translations')['translations']
  end

  test 'anonymous users members and unrelated editors cannot read edit fields' do
    read_project(user: nil, expected: :forbidden)
    @grant.destroy!
    membership = UserProject.create!(user: @user, project: @project)
    membership.update_column(:workflow_state, 'project_access_granted')
    read_project(expected: :forbidden)
    UserRole.create!(user: @user, role: @role)
    @role.update!(project: Project.find_by!(shortname: 'test'))
    read_project(expected: :forbidden)
    assert_equal @project.id, read_project(profile: 'display')['id']
  end

  test 'target project editors and admins can read unshared settings and revocation blocks cached responses' do
    @project.update!(workflow_state: 'unshared')
    host! 'another.oral-history.localhost:47001'
    assert_equal @project.id, read_project(include: 'translations')['id']
    @role.role_permissions.destroy_all
    read_project(include: 'translations', expected: :forbidden)
    RolePermission.create!(role: @role, permission: @permission)
    assert_equal @project.id, read_project(include: 'translations')['id']
    @grant.destroy!
    read_project(include: 'translations', expected: :forbidden)
    assert_equal @project.id, read_project(user: User.find_by!(email: 'alice@example.com'))['id']
  end

  test 'cache reuse normalizes includes and aliases and separates display from edit responses' do
    first = read_project(include: 'translations,institutions')
    Api::V2::ProjectEditSerializer.stub(:new, ->(*) { flunk 'Expected a cached edit response' }) do
      assert_equal first, read_project(identifier: @project.shortname, include: ' institutions,translations,translations ')
    end
    assert_not read_project.key?('translations')
    @grant.destroy!
    display = read_project(profile: 'display')
    assert_not display.key?('contact_email')
    assert_not display.key?('translations')
    read_project(expected: :forbidden)
    get '/api/v2/projects', params: { all: true, locale: 'en' }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_not JSON.parse(response.body)['data'].find { |item| item['id'] == @project.id }.key?('contact_email')
  end

  test 'edit field and translation mutations invalidate cached responses without timestamp changes' do
    read_project(include: 'translations')
    changes = {
      contact_email: 'changed@example.org', aspect_x: 4, aspect_y: 3, archive_id_number_length: 8,
      fullname_on_landing_page: true, show_preview_img: true, show_legend: false,
      view_modes: ['list'], upload_types: ['bulk_photos'], logged_out_visible_registry_entry_ids: ['21'],
      hidden_registry_entry_ids: ['22'], hidden_transcript_registry_entry_ids: ['23'], pdf_registry_entry_ids: ['24'],
    }
    changes.each do |field, value|
      @project.update_columns(field => value)
      assert_equal value, read_project(include: 'translations')[field.to_s], field.to_s
    end
    %w[name display_name introduction more_text landing_page_text restricted_landing_page_text media_missing_text].each do |field|
      @translation.update_column(field, "Updated #{field}")
      english = read_project(include: 'translations')['translations'].find { |item| item['id'] == @translation.id }
      assert_equal "Updated #{field}", english[field]
    end
    extra = @project.translations.create!(locale: 'fr', name: 'Français')
    assert_includes read_project(include: 'translations')['translations'].map { |item| item['id'] }, extra.id
    extra.destroy!
    assert_not_includes read_project(include: 'translations')['translations'].map { |item| item['id'] }, extra.id
  end

  test 'translations include is edit only and all existing includes remain available' do
    edit = read_project(include: 'translations,counts,institutions,interview_languages,collection_preview')
    %w[translations interview_counts collection_counts institutions interview_languages collection_preview].each do |field|
      assert edit.key?(field), field
    end
    read_project(profile: 'display', include: 'translations', expected: :bad_request)
    get '/api/v2/projects', params: { include: 'translations' }
    assert_response :bad_request
    assert_api_response_schema('/api/v2/projects')
    read_project(include: 'unknown', expected: :bad_request)
    read_project(identifier: 'missing-project', expected: :not_found)
  end

  test 'editable affiliates preserve display fields and stored translations behind subtype permissions' do
    read_project(include: 'affiliates', expected: :forbidden)
    records = [CooperationPartner, Leader, Manager, Funder].map do |type|
      permission = Permission.find_or_create_by!(klass: type.name, action_name: 'update')
      RolePermission.create!(role: @role, permission: permission)
      affiliate = type.create!(project_id: @project.id, name_type: 'Organizational')
      affiliate.translations.create!(locale: 'en', name: '', first_name: nil, last_name: ' ')
      affiliate.translations.create!(locale: 'de', name: "German #{type.name}")
      affiliate
    end
    other = Leader.create!(project_id: Project.find_by!(shortname: 'test').id)
    edit = read_project(include: 'affiliates')
    display = read_project(profile: 'display', include: 'affiliates')
    records.each do |record|
      field = record.type.underscore.pluralize
      data = edit.fetch(field).sole
      assert_equal record.id, data['id']
      assert_equal display.fetch(field).sole, data.except('translations')
      assert_not display.fetch(field).sole.key?('translations')
      assert_equal record.translations.order(:id).pluck(:id), data['translations'].map { |translation| translation['id'] }
      english = data['translations'].find { |translation| translation['locale'] == 'en' }
      assert_equal ['', nil, ' '], english.values_at('name', 'first_name', 'last_name')
      assert_not_equal other.id, data['id']
    end
    @role.role_permissions.joins(:permission).find_by!(permissions: { klass: 'Funder' }).destroy!
    read_project(include: 'affiliates', expected: :forbidden)
    assert_equal records[1].id, read_project(profile: 'display', include: 'affiliates')['leaders'].sole['id']
  end

  test 'editable affiliate cache follows stored translations membership and deletion independently of defaults' do
    %w[CooperationPartner Leader Manager Funder].each do |type|
      permission = Permission.find_or_create_by!(klass: type, action_name: 'update')
      RolePermission.create!(role: @role, permission: permission)
    end
    leader = Leader.create!(project_id: @project.id, name_type: 'Personal')
    translation = leader.translations.create!(locale: 'en', first_name: 'Anna', last_name: 'Example')
    default = read_project
    assert_equal 'Anna Example', read_project(include: 'affiliates')['leaders'].sole['name']
    translation.update_columns(first_name: '', last_name: nil)
    stored = read_project(include: 'affiliates')['leaders'].sole['translations'].sole
    assert_equal ['', nil], stored.values_at('first_name', 'last_name')
    extra = leader.translations.create!(locale: 'fr', name: 'Stored French name')
    assert_includes read_project(include: 'affiliates')['leaders'].sole['translations'].map { |item| item['id'] }, extra.id
    extra.destroy!
    assert_equal [translation.id], read_project(include: 'affiliates')['leaders'].sole['translations'].map { |item| item['id'] }
    leader.update_column(:project_id, Project.find_by!(shortname: 'test').id)
    assert_empty read_project(include: 'affiliates')['leaders']
    leader.update_column(:project_id, @project.id)
    assert_equal leader.id, read_project(include: 'affiliates')['leaders'].sole['id']
    leader.destroy!
    assert_empty read_project(include: 'affiliates')['leaders']
    Api::V2::ProjectEditSerializer.stub(:new, ->(*) { flunk 'Omitted affiliates must keep their cached response' }) do
      assert_equal default, read_project
    end
  end

  test 'editable external links preserve footer fields and stored translations behind resource permission' do
    link = ExternalLink.create!(project_id: @project.id, internal_name: 'Editor label')
    english = link.translations.create!(locale: 'en', name: '', url: nil)
    link.translations.create!(locale: 'de', name: 'German link', url: 'https://example.org/de')
    read_project(include: 'external_links', expected: :forbidden)
    read_project(profile: 'display', include: 'external_links', expected: :bad_request)
    permission = Permission.find_or_create_by!(klass: 'ExternalLink', action_name: 'update')
    grant = RolePermission.create!(role: @role, permission: permission)
    edit = read_project(include: 'external_links')['external_links'].sole
    footer = read_project(include: 'footer')['external_links'].sole
    assert_equal footer, edit.except('internal_name', 'translations')
    assert_equal 'Editor label', edit['internal_name']
    assert_equal link.translations.order(:id).pluck(:id), edit['translations'].map { |item| item['id'] }
    assert_equal ['', nil], edit['translations'].find { |item| item['id'] == english.id }.values_at('name', 'url')
    assert_not footer.key?('translations')
    assert_equal [edit], read_project(include: 'footer,external_links')['external_links']
    assert_not read_project.key?('external_links')
    grant.destroy!
    read_project(include: 'external_links', expected: :forbidden)
    assert_equal footer, read_project(include: 'footer')['external_links'].sole
  end

  test 'editable external links cache follows internal fields translations ownership and deletion' do
    permission = Permission.find_or_create_by!(klass: 'ExternalLink', action_name: 'update')
    RolePermission.create!(role: @role, permission: permission)
    link = ExternalLink.create!(project_id: @project.id, internal_name: 'Before')
    translation = link.translations.create!(locale: 'en', name: 'Link', url: 'https://example.org')
    default = read_project
    assert_equal 'Before', read_project(include: 'external_links')['external_links'].sole['internal_name']
    link.update_column(:internal_name, 'After')
    assert_equal 'After', read_project(include: 'external_links')['external_links'].sole['internal_name']
    translation.update_columns(name: '', url: nil)
    assert_equal ['', nil], read_project(include: 'external_links')['external_links'].sole['translations'].sole.values_at('name', 'url')
    link.update_column(:project_id, Project.find_by!(shortname: 'test').id)
    assert_empty read_project(include: 'external_links')['external_links']
    link.update_column(:project_id, @project.id)
    assert_equal link.id, read_project(include: 'external_links')['external_links'].sole['id']
    link.destroy!
    assert_empty read_project(include: 'external_links')['external_links']
    Api::V2::ProjectEditSerializer.stub(:new, ->(*) { flunk 'Omitted links must keep their cached response' }) do
      assert_equal default, read_project
    end
  end

  test 'institution assignments are edit only and keep institution display data separate' do
    institution = Institution.create!(name: 'Institute', shortname: "inst#{SecureRandom.hex(2)}")
    assignment = InstitutionProject.create!(project_id: @project.id, institution: institution, primary: true)
    InstitutionProject.create!(project_id: Project.find_by!(shortname: 'test').id, institution: institution)
    read_project(include: 'institution_projects', expected: :forbidden)
    read_project(profile: 'display', include: 'institution_projects', expected: :bad_request)
    permission = Permission.find_or_create_by!(klass: 'InstitutionProject', action_name: 'update')
    grant = RolePermission.create!(role: @role, permission: permission)
    data = read_project(include: 'institution_projects')
    assert_equal [{ 'id' => assignment.id, 'institution_id' => institution.id, 'primary' => true }], data['institution_projects']
    assert_not data.key?('institutions')
    display = read_project(profile: 'display', include: 'institutions')
    combined = read_project(include: 'institutions,institution_projects')
    assert_equal display['institutions'], combined['institutions']
    assert_equal data['institution_projects'], combined['institution_projects']
    assert_not display.key?('institution_projects')
    assert_not read_project.key?('institution_projects')
    grant.destroy!
    read_project(include: 'institution_projects', expected: :forbidden)
    assert_equal display['institutions'], read_project(profile: 'display', include: 'institutions')['institutions']
  end

  test 'assignment cache follows institution primary ownership and deletion without affecting defaults' do
    permission = Permission.find_or_create_by!(klass: 'InstitutionProject', action_name: 'update')
    RolePermission.create!(role: @role, permission: permission)
    institution = Institution.create!(name: 'Institute', shortname: "inst#{SecureRandom.hex(2)}")
    assignment = InstitutionProject.create!(project_id: @project.id, institution: institution)
    default = read_project
    assert_equal false, read_project(include: 'institution_projects')['institution_projects'].sole['primary']
    assignment.update_columns(primary: true, institution_id: nil)
    data = read_project(include: 'institution_projects')['institution_projects'].sole
    assert_equal true, data['primary']
    assert_nil data['institution_id']
    assignment.update_columns(primary: nil, institution_id: institution.id)
    data = read_project(include: 'institution_projects')['institution_projects'].sole
    assert_equal false, data['primary']
    assert_equal institution.id, data['institution_id']
    assignment.update_column(:project_id, Project.find_by!(shortname: 'test').id)
    assert_empty read_project(include: 'institution_projects')['institution_projects']
    assignment.update_column(:project_id, @project.id)
    assert_equal assignment.id, read_project(include: 'institution_projects')['institution_projects'].sole['id']
    assignment.destroy!
    assert_empty read_project(include: 'institution_projects')['institution_projects']
    Api::V2::ProjectEditSerializer.stub(:new, ->(*) { flunk 'Omitted assignments must keep their cached response' }) do
      assert_equal default, read_project
    end
  end

  private

  def read_project(identifier: @project.id, expected: :success, user: @user, **parameters)
    login_as user if user
    get "/api/v2/projects/#{identifier}", params: { profile: 'edit', locale: 'en', **parameters }
    assert_response expected
    assert_api_response_schema(CONTRACT_PATH)
    JSON.parse(response.body)['data']
  end
end
