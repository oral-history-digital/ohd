require 'test_helper'
require 'minitest/mock'
require_relative '../../../support/api_schema_assertions'

class Api::V2::ProjectDetailTest < ActionDispatch::IntegrationTest
  include ApiSchemaAssertions
  CONTRACT_PATH = '/api/v2/projects/{identifier}'

  setup do
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::MemoryStore.new
    host! 'test.portal.oral-history.localhost:47001'
    @project = DataHelper.test_project(shortname: "detail#{SecureRandom.hex(2)}a", default_locale: 'de',
      primary_color: '#123456', secondary_color: '#abcdef', editorial_color: '#111111', display_ohd_link: true)
    @project.translations.find_or_initialize_by(locale: 'en').update!(name: 'Home title', introduction: 'Introduction', more_text: 'More home text')
    @project.translations.find_or_initialize_by(locale: 'de').update!(name: 'Startseite', introduction: 'Einleitung', more_text: 'Mehr Text')
    @institution = Institution.create!(name: 'Institute', shortname: "inst#{SecureRandom.hex(3)}")
    InstitutionProject.create!(project: @project, institution: @institution, primary: true)
    @collection = Collection.create!(project: @project, institution: @institution, name: 'Public collection', workflow_state: 'public')
    @hidden = Collection.create!(project: @project, institution: @institution, name: 'Hidden collection', workflow_state: 'unshared')
    interview = Interview.create!(project: @project, collection: @collection,
      archive_id: "#{@project.shortname}001", media_type: 'audio', workflow_state: 'public')
    InterviewLanguage.create!(interview: interview, language: Language.find_by!(code: 'eng'), spec: 'primary')
  end

  teardown do
    Rails.cache = @previous_cache
  end

  test 'display details include project home content with optional institution names and localized logo' do
    FileUtils.mkdir_p(Rails.root.join('tmp', 'files'))
    logo = Logo.new(ref: @project, locale: 'en')
    logo.file.attach(io: StringIO.new('logo'), filename: 'home-logo.png', content_type: 'image/png')
    logo.save!
    detail = read_detail(include: 'institutions')['data']
    assert_equal 'Home title', detail['name']
    assert_equal 'Introduction', detail['introduction']
    assert_equal 'More home text', detail['more_text']
    assert_equal true, detail['display_ohd_link']
    assert_equal logo.id, detail['logo']['id']
    assert_match(/home-logo.png/, detail['logo']['url'])
    assert_equal ['Institute'], detail['institutions'].map { |record| record['name'] }
    assert_equal '#123456', detail['primary_color']
    assert_equal '#abcdef', detail['secondary_color']
    assert_equal '#111111', detail['editorial_color']
    assert_equal @project.domain, detail['domain']
    assert_not detail.key?('featured_interviews')
    assert_not detail.key?('translations_attributes')
    assert_not detail.key?('contact_email')
    assert_equal %w[data], JSON.parse(response.body).keys
  end

  test 'ID and shortname aliases share a detail cache independently of the request host' do
    first = nil
    assert_equal 1, generations {
      first = read_detail
      host! 'another.oral-history.localhost:47001'
      assert_equal first, read_detail(identifier: @project.shortname, suffix: '.json', profile: 'display')
      assert_equal first, read_detail(identifier: "000#{@project.id}")
    }
    Api::V2::ProjectDisplaySerializer.stub(:new, ->(*) { flunk 'Cache hits must not serialize details again' }) do
      assert_equal first, read_detail
    end
    get '/api/v2/projects', params: { all: true, locale: 'en' }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_not JSON.parse(response.body)['data'].find { |record| record['id'] == @project.id }.key?('more_text')
  end

  test 'shortnames beginning with an existing numeric ID resolve as shortnames without integer coercion' do
    @project.update!(shortname: "#{Project.find_by!(shortname: 'test').id}a")
    assert_equal @project.id, read_detail(identifier: @project.shortname)['data']['id']
  end

  test 'includes keep the list field shapes and exclude other projects and unshared previews' do
    base = read_detail['data']
    %w[interview_counts collection_counts institutions interview_languages collection_preview].each do |field|
      assert_not base.key?(field)
    end
    expected = nil
    assert_equal 1, generations {
      expected = read_detail(include: 'counts,institutions,interview_languages,collection_preview')
      assert_equal expected, read_detail(include: ' collection_preview, counts, institutions, interview_languages,counts ')
    }
    detail = expected['data']
    assert_equal({ 'public' => 1, 'restricted' => 0, 'unshared' => 0, 'total' => 1 }, detail['interview_counts'])
    assert_equal({ 'public' => 1, 'restricted' => 0, 'total' => 1 }, detail['collection_counts'])
    assert_equal ['eng'], detail['interview_languages']
    assert_equal [@collection.id], detail['collection_preview'].map { |record| record['id'] }
    assert_equal [@institution.id], detail['institutions'].map { |record| record['id'] }
  end

  test 'locale fallback is independent of enabled project locales and refreshed after text edits' do
    @project.update!(available_locales: ['de'])
    assert_equal 'More home text', read_detail['data']['more_text']
    @project.translations.find_by!(locale: 'en').update_column(:more_text, '   ')
    assert_equal 'Mehr Text', read_detail['data']['more_text']
    detail = read_detail(locale: 'ar')['data']
    assert_equal 'Mehr Text', detail['more_text']
    assert_equal ['de'], detail['available_locales']
    assert_equal 'ar', response.headers['Content-Language']
    @project.translations.find_by!(locale: 'de').update_column(:more_text, 'Geändert')
    assert_equal 'Geändert', read_detail(locale: 'ar')['data']['more_text']
    @project.translations.update_all(more_text: nil)
    assert_nil read_detail['data']['more_text']
  end

  test 'detail-only fields refresh cached responses and boolean fields never return null' do
    assert_nil read_detail['data']['oai_doi_identifier']
    @project.update_columns(primary_color: '#654321', doi_status: 'created', has_map: nil,
      is_catalog: nil, has_newsletter: nil, display_ohd_link: nil)
    detail = read_detail['data']
    assert_equal '#654321', detail['primary_color']
    assert_equal @project.oai_doi_identifier, detail['oai_doi_identifier']
    %w[has_map is_catalog has_newsletter display_ohd_link].each { |field| assert_equal false, detail[field] }
    old_shortname = @project.shortname
    @project.update!(shortname: "new#{SecureRandom.hex(3)}a")
    read_detail(identifier: old_shortname, expected: :not_found)
    assert_equal @project.id, read_detail(identifier: @project.shortname)['data']['id']
    @project.update_column(:doi_status, nil)
    assert_nil read_detail['data']['oai_doi_identifier']
  end

  test 'target project authorization is checked before returning cached details' do
    @project.update!(workflow_state: 'unshared')
    read_detail(expected: :forbidden)
    user = User.find_by!(email: 'john@example.com')
    other = Project.find_by!(shortname: 'test')
    UserRole.create!(user: user, role: Role.create!(project: other, name: 'Other editor'))
    login_as user
    read_detail(expected: :forbidden)
    membership = UserProject.create!(user: user, project: @project)
    membership.update_column(:workflow_state, 'project_access_granted')
    assert_equal @project.id, read_detail['data']['id']
    membership.destroy!
    read_detail(expected: :forbidden)
    grant = UserRole.create!(user: user, role: Role.create!(project: @project, name: 'Target reader'))
    assert_equal @project.id, read_detail['data']['id']
    grant.destroy!
    read_detail(expected: :forbidden)
    login_as User.find_by!(email: 'alice@example.com')
    assert_equal @project.id, read_detail['data']['id']
    @project.destroy!
    read_detail(expected: :not_found)
  end

  test 'collection editors receive only previews authorized in the target project' do
    user = User.find_by!(email: 'john@example.com')
    permission = Permission.find_or_create_by!(klass: 'Collection', action_name: 'update')
    role = Role.create!(project: Project.find_by!(shortname: 'test'), name: 'Editor')
    RolePermission.create!(role: role, permission: permission)
    UserRole.create!(user: user, role: role)
    login_as user
    assert_equal [@collection.id], read_detail(include: 'collection_preview')['data']['collection_preview'].map { |record| record['id'] }
    role.update!(project: @project)
    assert_equal [@collection.id, @hidden.id].sort, read_detail(include: 'collection_preview')['data']['collection_preview'].map { |record| record['id'] }
    role.role_permissions.destroy_all
    assert_equal [@collection.id], read_detail(include: 'collection_preview')['data']['collection_preview'].map { |record| record['id'] }
  end

  test 'authorization receives the target project context instead of the host context' do
    constructor = ProjectPolicy.method(:new)
    contexts = []
    capture = lambda do |context, record|
      contexts << context.project
      constructor.call(context, record)
    end
    ProjectPolicy.stub(:new, capture) { read_detail }
    assert_not_empty contexts
    assert contexts.all? { |project| project.id == @project.id }
  end

  test 'missing projects and invalid request options return documented JSON errors' do
    response = read_detail(identifier: 'missing-project', expected: :not_found)
    assert_equal 'not_found', response['error']['code']
    read_detail(identifier: '9' * 40, expected: :not_found)
    [ { profile: 'edit' }, { profile: '' }, { profile: ['display'] },
      { locale: '' }, { locale: 'unknown' }, { locale: ['en'] },
      { include: '' }, { include: 'unknown' }, { include: ['institutions'] } ].each do |parameters|
      error = read_detail(expected: :bad_request, **parameters)['error']
      assert_equal 'invalid_parameter', error['code']
      assert_equal parameters.keys.first.to_s, error['parameter']
    end
    read_detail(suffix: '.html', expected: :not_acceptable)
  end

  private

  def read_detail(identifier: @project.id, suffix: '', expected: :success, **parameters)
    get "/api/v2/projects/#{identifier}#{suffix}", params: { locale: 'en', **parameters }
    assert_response expected
    assert_api_response_schema(CONTRACT_PATH)
    JSON.parse(response.body)
  end

  def generations
    count = 0
    subscriber = ->(*event) { count += 1 if event.last[:key].to_s.start_with?('api/v2/projects/show/') }
    ActiveSupport::Notifications.subscribed(subscriber, 'cache_generate.active_support') { yield }
    count
  end
end
