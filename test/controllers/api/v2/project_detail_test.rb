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
    @interview = Interview.create!(project: @project, collection: @collection,
      archive_id: "#{@project.shortname}001", media_type: 'audio', workflow_state: 'public')
    InterviewLanguage.create!(interview: @interview, language: Language.find_by!(code: 'eng'), spec: 'primary')
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
    base = nil
    ProjectMetricsRepository.stub(:new, ->(*) { flunk 'Base details must not calculate catalog metrics' }) do
      base = read_detail['data']
    end
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
    login_as user
    assert_equal [@collection.id, @hidden.id].sort, read_detail(include: 'collection_preview')['data']['collection_preview'].map { |record| record['id'] }
    role.role_permissions.destroy_all
    login_as user
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
    [ { profile: 'unknown' }, { profile: '' }, { profile: ['display'] },
      { locale: '' }, { locale: 'unknown' }, { locale: ['en'] },
      { include: '' }, { include: 'unknown' }, { include: ['institutions'] } ].each do |parameters|
      error = read_detail(expected: :bad_request, **parameters)['error']
      assert_equal 'invalid_parameter', error['code']
      assert_equal parameters.keys.first.to_s, error['parameter']
    end
    read_detail(suffix: '.html', expected: :not_acceptable)
  end

  test 'catalog additions are opt-in detail fields with documented empty values' do
    fields = %w[media_types interview_year_range birth_year_range subjects levels_of_indexing cooperation_partners leaders managers funders]
    base = read_detail['data']
    fields.each { |field| assert_not base.key?(field) }
    params = { include: 'media_types,year_ranges,subjects,levels_of_indexing,affiliates' }
    detail = read_detail(**params)['data']
    assert_equal({ 'audio' => 1, 'video' => 0 }, detail['media_types'])
    %w[interview_year_range birth_year_range].each do |field|
      assert_equal({ 'min' => nil, 'max' => nil }, detail[field])
    end
    (fields - %w[media_types interview_year_range birth_year_range]).each { |field| assert_equal [], detail[field] }
    assert_equal 0, generations { read_detail(include: ' affiliates,subjects,levels_of_indexing,year_ranges,media_types,affiliates ') }
    get '/api/v2/projects', params: params
    assert_response :bad_request
    assert_api_response_schema('/api/v2/projects')
    login_as User.find_by!(email: 'alice@example.com')
    edit = read_detail(profile: 'edit', **params)['data']
    fields.each { |field| assert_equal detail[field], edit[field] }
  end

  test 'catalog media and year aggregates refresh after edits deletions and reassignment' do
    type = ContributionType.create!(project: @project, code: 'interviewee', label: 'Interviewee')
    person = Person.create!(project: @project, first_name: 'Ada', last_name: 'Example', date_of_birth: '1922-02-01')
    contribution = Contribution.create!(interview: @interview, person: person, contribution_type: type)
    @interview.update_columns(interview_date: '1979-1981', media_type: 'video', workflow_state: 'unshared')
    other = DataHelper.test_project(shortname: "other#{SecureRandom.hex(3)}a")
    Interview.create!(project: other, archive_id: "#{other.shortname}001", media_type: 'audio', interview_date: '2000')
    options = { include: 'media_types,year_ranges' }
    detail = read_detail(**options)['data']
    assert_equal({ 'audio' => 0, 'video' => 1 }, detail['media_types'])
    assert_equal({ 'min' => 1979, 'max' => 1981 }, detail['interview_year_range'])
    assert_equal({ 'min' => 1922, 'max' => 1922 }, detail['birth_year_range'])
    assert_equal 0, generations { read_detail(**options) }
    person.update_column(:date_of_birth, '1930')
    assert_equal 1930, read_detail(**options)['data']['birth_year_range']['min']
    type.update_column(:code, 'interviewer')
    assert_nil read_detail(**options)['data']['birth_year_range']['min']
    type.update_column(:code, 'interviewee')
    assert_equal 1930, read_detail(**options)['data']['birth_year_range']['min']
    contribution.destroy!
    assert_nil read_detail(**options)['data']['birth_year_range']['min']
    @project.update_column(:workflow_state, 'unshared')
    read_detail(expected: :forbidden, **options)
    login_as User.find_by!(email: 'alice@example.com')
    assert_equal({ 'audio' => 0, 'video' => 0 }, read_detail(**options)['data']['media_types'])
    @project.update_column(:workflow_state, 'public')
    @interview.update_columns(project_id: other.id, interview_date: '1999')
    assert_nil read_detail(**options)['data']['interview_year_range']['min']
    assert_equal({ 'audio' => 0, 'video' => 0 }, read_detail(**options)['data']['media_types'])
  end

  test 'affiliate includes localize names preserve personal name rules and refresh independently of base details' do
    leader = Leader.create!(project: @project, name_type: 'Personal')
    leader.translations.find_or_initialize_by(locale: 'en').update!(name: 'Ignored organization', first_name: 'Ada', last_name: 'Lovelace')
    leader.translations.find_or_initialize_by(locale: 'de').update!(first_name: 'Augusta', last_name: 'Deutsch')
    partner = CooperationPartner.create!(project: @project, name_type: 'Organizational')
    partner.translations.find_or_initialize_by(locale: 'en').update!(name: 'Museum', first_name: 'Ignored')
    manager = Manager.create!(project: @project, name_type: 'Organizational', name: 'Archive manager')
    funder = Funder.create!(project: @project, name_type: 'Organizational', name: 'Foundation')
    Funder.create!(project: Project.find_by!(shortname: 'test'), name_type: 'Organizational', name: 'Other project')
    options = { include: 'affiliates' }
    detail = read_detail(**options)['data']
    assert_equal ['Ada Lovelace'], detail['leaders'].map { |record| record['name'] }
    assert_equal ['Museum'], detail['cooperation_partners'].map { |record| record['name'] }
    assert_equal [manager.id], detail['managers'].map { |record| record['id'] }
    assert_equal [funder.id], detail['funders'].map { |record| record['id'] }
    assert_equal 'Augusta Deutsch', read_detail(locale: 'de', **options)['data']['leaders'].first['name']
    read_detail
    leader.translations.find_by!(locale: 'en').update_column(:first_name, '  ')
    assert_equal 'Augusta Lovelace', read_detail(**options)['data']['leaders'].first['name']
    assert_equal 0, generations { read_detail }
    leader.update_column(:project_id, Project.find_by!(shortname: 'test').id)
    assert_empty read_detail(**options)['data']['leaders']
    partner.destroy!
    assert_empty read_detail(**options)['data']['cooperation_partners']
  end

  test 'catalog registry includes follow umbrella hierarchy and refresh after label and reference changes' do
    umbrella = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(3)}a")
    InstanceSetting.current.update!(umbrella_project: umbrella)
    subjects = umbrella.root_registry_entry.create_child('Subjects', :en)
    subjects.update!(code: 'subjects')
    subject = subjects.create_child('Memory', :en)
    subject.registry_names.first.translations.find_or_initialize_by(locale: 'de').update!(descriptor: 'Erinnerung')
    levels = umbrella.root_registry_entry.create_child('Indexing', :en)
    levels.update!(code: 'level_of_indexing')
    level = levels.create_child('Transcript', :en)
    reference = RegistryReference.create!(interview: @interview, ref_object: @interview, registry_entry: subject,
      workflow_state: 'checked', ref_position: 0)
    RegistryReference.create!(interview: @interview, ref_object: @interview, registry_entry: level,
      workflow_state: 'checked', ref_position: 0)
    other_interview = Interview.create!(project: umbrella, archive_id: "#{umbrella.shortname}001", media_type: 'audio')
    RegistryReference.create!(interview: other_interview, ref_object: other_interview, registry_entry: level,
      workflow_state: 'checked', ref_position: 0)
    options = { include: 'subjects,levels_of_indexing' }
    assert_equal ['Memory'], read_detail(**options)['data']['subjects']
    assert_equal ['Erinnerung'], read_detail(locale: 'de', **options)['data']['subjects']
    assert_equal [{ 'descriptor' => 'Transcript', 'count' => 1 }], read_detail(**options)['data']['levels_of_indexing']
    assert_equal 0, generations { read_detail(**options) }
    read_detail
    subject.registry_names.first.translations.find_by!(locale: 'en').update_column(:descriptor, '  ')
    assert_equal ['Erinnerung'], read_detail(**options)['data']['subjects']
    assert_equal 0, generations { read_detail }
    reference.destroy!
    assert_empty read_detail(**options)['data']['subjects']
    RegistryHierarchy.where(ancestor_id: levels.id, descendant_id: level.id).delete_all
    assert_empty read_detail(**options)['data']['levels_of_indexing']
    InstanceSetting.current.update!(umbrella_project_id: @project.id)
    assert_empty read_detail(**options)['data']['levels_of_indexing']
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
