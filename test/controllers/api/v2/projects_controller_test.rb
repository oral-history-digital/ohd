require 'test_helper'
require_relative '../../../support/api_schema_assertions'

class Api::V2::ProjectsControllerTest < ActionDispatch::IntegrationTest
  include ApiSchemaAssertions

  setup do
    # These tests measure uncached endpoint behavior. Cache reuse has its own tests.
    @previous_cache = Rails.cache
    Rails.cache = ActiveSupport::Cache::NullStore.new
    host! 'test.portal.oral-history.localhost:47001'
    @project = Project.find_by!(shortname: 'test')
    @umbrella = InstanceSetting.current.umbrella_project
  end

  teardown do
    Rails.cache = @previous_cache
  end

  test 'OpenAPI document is valid and lists all supported request locales' do
    errors = api_schema.validate.to_a
    assert_empty errors, errors.map { |error| error['error'] }.join("\n")
    locale = ApiSchemaAssertions.definition['paths']['/api/v2/projects']['get']['parameters'].find { |parameter| parameter['name'] == 'locale' }
    assert_equal I18n.available_locales.map(&:to_s).sort, locale['schema']['enum'].sort
  end

  test 'OpenAPI include choices match the controller allowlists' do
    {
      '/api/v2/projects' => Api::V2::ProjectsController::LIST_INCLUDES,
      '/api/v2/projects/{identifier}' => Api::V2::ProjectsController::EDIT_INCLUDES,
    }.each do |path, allowed|
      parameters = ApiSchemaAssertions.definition.fetch('paths').fetch(path).fetch('get').fetch('parameters')
      include_schema = parameters.find { |parameter| parameter['name'] == 'include' }.fetch('schema')
      # The pattern declares the same choices for the first and subsequent comma-separated names.
      choices = include_schema.fetch('pattern').scan(/\(([^()]+)\)/).flat_map { |group| group.first.split('|') }.uniq
      assert_equal allowed.sort, choices.sort, path
    end
  end

  test 'generated OpenAPI document matches the Ruby contract' do
    generated = YAML.safe_load_file(Rails.root.join('doc/api/v2/openapi.yaml'))
    assert_equal ApiSchemaAssertions.definition, generated,
      'Run bundle exec rake api:generate and include the updated YAML.'
  end

  test 'schema rejects missing fields, wrong types, and accidental editor data' do
    get '/api/v2/projects'
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    schema = api_schema.schema('ProjectListResponse')

    missing_field = body
    missing_field['data'].first.delete('shortname')
    assert_not schema.valid?(missing_field)

    wrong_type = body
    wrong_type['data'].first['id'] = '7'
    assert_not schema.valid?(wrong_type)

    protected_field = body
    protected_field['data'].first['contact_email'] = 'editor@example.org'
    assert_not schema.valid?(protected_field)
  end

  test 'legacy records retain nullable text fields and return boolean access flags' do
    @project.translations.delete_all
    @project.update_columns(default_locale: nil, display_shortname: nil,
      grant_access_without_login: nil, grant_project_access_instantly: nil)
    get '/api/v2/projects'
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    summary = body['data'].find { |project| project['id'] == @project.id }
    assert_nil summary['name']
    assert_nil summary['default_locale']
    assert_equal false, summary['grant_access_without_login']
    assert_equal false, summary['grant_project_access_instantly']
  end

  test 'extensionless anonymous requests return the default summary and pagination' do
    get '/api/v2/projects'

    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_equal 'application/json', response.media_type
    assert_equal I18n.locale.to_s, response.headers['Content-Language']
    assert_equal %w[data pagination], body.keys.sort
    expected = Project.where(workflow_state: 'public').where.not(id: @umbrella.id).count
    assert_equal({ 'page' => 1, 'per_page' => 25, 'total_pages' => (expected / 25.0).ceil, 'total_count' => expected }, body['pagination'])
    summary = body['data'].find { |project| project['id'] == @project.id }
    assert summary
    assert_equal @project.shortname, summary['shortname']
    assert_kind_of String, summary['name']
    assert summary.key?('grant_access_without_login')
    assert summary.key?('logo')
    assert_not summary.key?('translations_attributes')
    assert_not summary.key?('contact_email')
    assert_not summary.key?('collections')
    assert_not summary.key?('interview_counts')
  end

  test 'explicit locale selects localized strings without requiring project locale availability' do
    @project.update!(available_locales: ['de'], default_locale: 'de')
    @project.translations.find_or_initialize_by(locale: 'de').update!(name: 'Deutscher Name', introduction: 'Einleitung')
    @project.translations.find_or_initialize_by(locale: 'en').update!(name: 'English name', introduction: 'Introduction')

    get '/api/v2/projects.json', params: { locale: 'en', all: true }

    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    summary = body['data'].find { |project| project['id'] == @project.id }
    assert_equal 'English name', summary['name']
    assert_equal 'Introduction', summary['introduction']
    assert_equal ['de'], summary['available_locales']
    assert_equal 'en', response.headers['Content-Language']
  end

  test 'omitted locale uses the current locale without leaking an explicit locale' do
    I18n.with_locale(:de) do
      get '/api/v2/projects', params: { locale: 'en' }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      assert_equal :de, I18n.locale
      get '/api/v2/projects'
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      assert_equal 'de', response.headers['Content-Language']
    end
  end

  test 'global results do not depend on the request project domain or request project_id' do
    @project.update!(archive_domain: 'http://archive-api.example')
    private_project = new_project(workflow_state: 'unshared')
    get '/api/v2/projects', params: { all: true }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    expected = body

    host! URI.parse(@project.archive_domain).host
    get '/api/v2/projects', params: { all: true, project_id: private_project.shortname }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_equal expected, body
    assert_not_includes ids, private_project.id

    host! 'unknown-api-host.example'
    get '/api/v2/projects', params: { all: true }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_equal expected, body
  end

  test 'anonymous users cannot expose unshared projects through filters or all mode' do
    hidden = new_project(workflow_state: 'unshared')
    get '/api/v2/projects', params: { all: true, workflow_state: 'public,unshared', include_umbrella: true }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_not_includes ids, hidden.id

    get '/api/v2/projects', params: { all: true, workflow_state: 'unshared' }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_empty body['data']
    assert_equal({ 'page' => 1, 'per_page' => 0, 'total_pages' => 1, 'total_count' => 0 }, body['pagination'])
  end

  test 'membership and project roles expose only their authorized unshared projects' do
    member_project = new_project(workflow_state: 'unshared')
    role_project = new_project(workflow_state: 'unshared')
    denied_project = new_project(workflow_state: 'unshared')
    user = User.find_by!(email: 'john@example.com')
    membership = UserProject.create!(user: user, project: member_project)
    membership.update_column(:workflow_state, 'project_access_granted')
    user.roles << Role.create!(project: role_project, name: 'Editor')
    login_as user

    get '/api/v2/projects', params: { all: true, workflow_state: 'unshared' }

    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_includes ids, member_project.id
    assert_includes ids, role_project.id
    assert_not_includes ids, denied_project.id
    assert_equal 2, body['pagination']['total_count']
  end

  test 'admins can list unshared projects and filter by workflow state' do
    hidden = new_project(workflow_state: 'unshared')
    login_as User.find_by!(email: 'alice@example.com')

    get '/api/v2/projects', params: { all: true, workflow_state: 'unshared' }

    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_includes ids, hidden.id
    assert body['data'].all? { |project| project['workflow_state'] == 'unshared' }
  end

  test 'umbrella inclusion follows instance settings and explicit boolean values' do
    InstanceSetting.current.update!(umbrella_project: @project)
    get '/api/v2/projects', params: { all: true, include_umbrella: false }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_not_includes ids, @project.id

    get '/api/v2/projects', params: { all: true, include_umbrella: true }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_includes ids, @project.id
    assert body['data'].find { |project| project['id'] == @project.id }['is_umbrella']
    assert_not body['data'].find { |project| project['id'] == @umbrella.id }['is_umbrella']
  end

  test 'pagination is deterministic and counts the filtered policy scope' do
    first = new_project
    second = new_project
    timestamp = 1.day.from_now
    [first, second].each { |project| project.update_column(:created_at, timestamp) }

    get '/api/v2/projects', params: { page: 1, per_page: 1 }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    total = body['pagination']['total_count']
    assert_equal [second.id], ids
    assert_equal total, body['pagination']['total_pages']

    get '/api/v2/projects', params: { page: 2, per_page: 1, all: false }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_equal [first.id], ids
    assert_equal total, body['pagination']['total_count']

    get '/api/v2/projects', params: { page: total + 1, per_page: 1 }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_empty ids
    assert_equal total, body['pagination']['total_count']

    get '/api/v2/projects', params: { page: '9' * 40, per_page: 1 }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_empty ids
    assert_equal total, body['pagination']['total_count']
  end

  test 'loading more summaries does not add a query for each project' do
    5.times { new_project }
    # Warm serializer/model metadata before comparing actual data queries.
    get '/api/v2/projects', params: { per_page: 1 }
    small = list_queries(per_page: 1)
    large = list_queries(per_page: 100)
    assert_operator ids.length, :>=, 6
    assert_operator large.length, :<=, small.length + 2,
      "Queries grew from #{small.length} to #{large.length} for #{ids.length} summaries"
  end

  test 'sorts project columns in either direction before pagination' do
    first = new_project(shortname: 'sortaa', display_shortname: 'Zulu', publication_date: '2003')
    second = new_project(shortname: 'sortbb', display_shortname: 'Middle', publication_date: '2001')
    third = new_project(shortname: 'sortcc', display_shortname: 'Alpha', publication_date: '2002')
    [second, third, first].each_with_index { |project, index| project.update_column(:created_at, 1.day.ago + index.minutes) }
    show_only(first, second, third)

    {
      'shortname' => [first.id, second.id, third.id],
      'id' => [first.id, second.id, third.id],
      'created_at' => [second.id, third.id, first.id],
      'publication_date' => [second.id, third.id, first.id],
    }.each do |field, expected|
      get '/api/v2/projects', params: { sort: field, all: true }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      assert_equal expected, ids, field
      get '/api/v2/projects', params: { sort: "-#{field}", all: true }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      assert_equal expected.reverse, ids, "-#{field}"
    end

    get '/api/v2/projects', params: { sort: '-shortname', per_page: 1 }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_equal [third.id], ids
    assert_equal 3, body['pagination']['total_count']
  end

  test 'name sorting follows localized display names and project fallback with nulls last' do
    first, second, fallback, plain, unnamed = 5.times.map { new_project(default_locale: 'de') }
    other_language = new_project(default_locale: 'uk')
    other_language.translations.delete_all
    translate(other_language, 'ru', name: 'Fallback', display_name: 'Gamma')
    translate(other_language, 'de', name: 'Fallback', display_name: 'ZZZ')
    show_only(first, second, fallback, plain, unnamed, other_language)
    [first, second, fallback, plain, unnamed].each { |project| project.translations.update_all(name: nil, display_name: nil) }
    translate(first, 'en', name: 'Zulu', display_name: 'Alpha')
    translate(first, 'de', name: 'Alpha', display_name: 'Zulu')
    translate(second, 'en', name: 'Alpha', display_name: 'Zulu')
    translate(second, 'de', name: 'Zulu', display_name: 'Alpha')
    translate(fallback, 'en', name: 'Aardvark', display_name: nil)
    translate(fallback, 'de', name: 'Fallback', display_name: 'Middle')
    translate(plain, 'en', name: 'Beta', display_name: " \t ")
    translate(plain, 'de', name: 'Beta', display_name: nil)

    [
      ['en', 'name', [first.id, plain.id, other_language.id, fallback.id, second.id, unnamed.id]],
      ['de', 'name', [second.id, plain.id, fallback.id, first.id, other_language.id, unnamed.id]],
      ['en', '-name', [second.id, fallback.id, other_language.id, plain.id, first.id, unnamed.id]],
    ].each do |locale, sort, expected|
      get '/api/v2/projects', params: { locale: locale, sort: sort, all: true }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      assert_equal expected, ids, "#{locale}: #{sort}"
    end
  end

  test 'name sorting ignores leading punctuation before pagination and preserves response labels' do
    labels = [
      '„Meine Spur“: Kinder und Jugendliche im Krieg',
      '(Post-)migrantisches Leben in der DDR und in Ostdeutschland',
      'Leben', 'Nachbarn', 'Orte', 'Quellen',
    ]
    projects = labels.map do |label|
      project = new_project
      project.translations.update_all(name: label, display_name: nil)
      project
    end
    show_only(*projects)
    expected = [projects[2], projects[0], projects[3], projects[4], projects[1], projects[5]].map(&:id)

    { 'name' => expected, '-name' => expected.reverse }.each do |sort, order|
      get '/api/v2/projects', params: { sort: sort, all: true }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      assert_equal order, ids
      projects.each_with_index do |project, index|
        assert_equal labels[index], body['data'].find { |record| record['id'] == project.id }['name']
      end

      get '/api/v2/projects', params: { sort: sort, page: 2, per_page: 2 }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      assert_equal order.slice(2, 2), ids
    end
  end

  test 'name sorting preserves accented and non-Latin letters after leading punctuation' do
    [
      ['de', " \t„Äpfel“", 'Banane'],
      ['ru', '«Альфа»', 'Бета'],
      ['ar', "\u00a0(أرشيف)", 'مكتبة'],
    ].each do |locale, first_label, second_label|
      second, first = 2.times.map { new_project }
      translate(first, locale, display_name: first_label)
      translate(second, locale, display_name: second_label)
      show_only(first, second)

      { 'name' => [first.id, second.id], '-name' => [second.id, first.id] }.each do |sort, expected|
        get '/api/v2/projects', params: { locale: locale, sort: sort, all: true }
        assert_response :success
        assert_api_response_schema('/api/v2/projects')
        assert_equal expected, ids, "#{locale}: #{sort}"
        assert_equal first_label, body['data'].find { |record| record['id'] == first.id }['display_name']
      end
    end
  end

  test 'name and publication date ties use ID in the requested direction' do
    first, second = 2.times.map { new_project(publication_date: nil) }
    [first, second].each { |project| project.translations.update_all(name: 'Same name', display_name: nil) }
    show_only(first, second)
    %w[name publication_date].each do |sort|
      get '/api/v2/projects', params: { sort: sort, per_page: 1, page: 1 }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      assert_equal [first.id], ids
      get '/api/v2/projects', params: { sort: sort, per_page: 1, page: 2 }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      assert_equal [second.id], ids
      get '/api/v2/projects', params: { sort: "-#{sort}", per_page: 1 }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      assert_equal [second.id], ids
    end

    dated = new_project(publication_date: '2001')
    show_only(first, second, dated)
    { 'publication_date' => [dated.id, first.id, second.id], '-publication_date' => [dated.id, second.id, first.id] }.each do |sort, expected|
      get '/api/v2/projects', params: { sort: sort, all: true }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      assert_equal expected, ids
    end
  end

  test 'sorting preserves the project policy scope' do
    hidden = new_project(workflow_state: 'unshared')
    get '/api/v2/projects', params: { sort: 'name', all: true, workflow_state: 'public,unshared' }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_not_includes ids, hidden.id
  end

  test 'all mode reports one page and accepts the all workflow filter' do
    get '/api/v2/projects', params: { all: true, workflow_state: 'all' }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    count = ids.length
    assert_equal({ 'page' => 1, 'per_page' => count, 'total_pages' => 1, 'total_count' => count }, body['pagination'])
  end

  test 'invalid parameters return consistent JSON errors instead of redirects or exceptions' do
    invalid = [
      { locale: 'unsupported' }, { locale: '' }, { locale: ['en'] },
      { page: '0' }, { page: '-1' }, { page: '1.5' }, { page: ['1'] },
      { per_page: '0' }, { per_page: '101' }, { per_page: 'many' },
      { all: 'yes' }, { all: '' }, { include_umbrella: '1' },
      { workflow_state: 'private' }, { workflow_state: 'public,private' },
      { workflow_state: ['public'] }, { workflow_state: '' },
      { include: '' }, { include: 'unknown' }, { include: 'counts,' },
      { include: 'counts,unknown' }, { include: ['counts'] }, { profile: 'edit' },
      { sort: '' }, { sort: 'contact_email' }, { sort: 'name,-id' },
      { sort: ['name'] }, { sort: 'shortname; DROP TABLE projects' },
    ]
    invalid.each do |parameters|
      get '/api/v2/projects', params: parameters
      assert_response :bad_request, parameters.inspect
      assert_api_response_schema('/api/v2/projects')
      assert_equal 'application/json', response.media_type
      assert_equal 'invalid_parameter', body.dig('error', 'code')
      assert_equal parameters.keys.first.to_s, body.dig('error', 'parameter')
      assert body.dig('error', 'message').present?
    end
  end

  test 'all mode rejects even default or empty explicit pagination parameters' do
    [{ page: 1 }, { per_page: 25 }, { page: '' }].each do |pagination|
      get '/api/v2/projects', params: { all: true, **pagination }
      assert_response :bad_request
      assert_api_response_schema('/api/v2/projects')
      assert_equal pagination.keys.first.to_s, body.dig('error', 'parameter')
    end
  end

  test 'explicit HTML requests receive a JSON format error' do
    get '/api/v2/projects.html'
    assert_response :not_acceptable
    assert_api_response_schema('/api/v2/projects')
    assert_equal 'application/json', response.media_type
    assert_equal 'not_acceptable', body.dig('error', 'code')
  end

  test 'each include adds only its fields and omitted includes do not query catalog data' do
    project = new_project
    catalog_records(project)
    show_only(project)
    fields = {
      'counts' => %w[interview_counts collection_counts],
      'institutions' => %w[institutions],
      'interview_languages' => %w[interview_languages],
      'collection_preview' => %w[collection_preview],
    }
    base_queries = list_queries(all: true)
    base_keys = body['data'].first.keys
    assert_empty base_keys & fields.values.flatten
    assert_empty base_queries.grep(/FROM [`"]?(?:interviews|collections|institutions|institution_projects|interview_languages)[`"]?\s/i)

    fields.each do |include_name, added|
      queries = list_queries(all: true, include: include_name)
      summary = body['data'].first
      assert_equal added.sort, (summary.keys - base_keys).sort
      case include_name
      when 'counts'
        assert_equal({ 'public' => 1, 'restricted' => 1, 'unshared' => 1, 'total' => 3 }, summary['interview_counts'])
        assert_equal({ 'public' => 1, 'restricted' => 0, 'total' => 1 }, summary['collection_counts'])
        assert_empty queries.grep(/FROM [`"]?(?:institutions|interview_languages)[`"]?\s/i)
      when 'interview_languages'
        assert_equal ['eng'], summary['interview_languages']
        assert_empty queries.grep(/FROM [`"]?(?:institutions|collections)[`"]?\s/i)
      when 'collection_preview'
        assert_equal ['Public collection'], summary['collection_preview'].map { |record| record['name'] }
      end
    end
  end

  test 'include combinations ignore duplicates and order and return empty values for projects without catalog data' do
    project = new_project
    show_only(project)
    get '/api/v2/projects', params: { all: true, include: 'counts,institutions,interview_languages,collection_preview' }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    expected = body
    summary = body['data'].first
    assert_equal({ 'public' => 0, 'restricted' => 0, 'unshared' => 0, 'total' => 0 }, summary['interview_counts'])
    assert_equal({ 'public' => 0, 'restricted' => 0, 'total' => 0 }, summary['collection_counts'])
    %w[institutions interview_languages collection_preview].each { |field| assert_equal [], summary[field] }

    get '/api/v2/projects', params: { all: true, include: ' collection_preview, counts, institutions, counts, interview_languages ' }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_equal expected, body

    get '/api/v2/projects', params: { page: 2, per_page: 1, include: 'counts,institutions,interview_languages,collection_preview' }
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    assert_empty body['data']
    assert_equal 1, body['pagination']['total_count']
  end

  test 'nested names and preview notes use explicit locale and project default fallback' do
    project = new_project(default_locale: 'de')
    records = catalog_records(project)
    show_only(project)
    [records[:institution], records[:parent], records[:collection]].each do |record|
      record.translations.delete_all
      record.translations.create!(locale: 'ru', name: 'Russian fallback')
      record.translations.create!(locale: 'de', name: 'German fallback')
      record.translations.create!(locale: 'en', name: 'English name')
    end
    records[:collection].translations.find_by!(locale: 'de').update!(notes: 'Deutsche Beschreibung')
    records[:collection].translations.find_by!(locale: 'en').update!(notes: '   ')

    [['en', 'English name'], ['ar', 'German fallback']].each do |locale, expected_name|
      get '/api/v2/projects', params: { all: true, locale: locale, include: 'institutions,collection_preview' }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      summary = body['data'].first
      institution = summary['institutions'].first
      assert_equal expected_name, institution['name']
      assert_equal expected_name, institution['parent']['name']
      assert_equal true, institution['is_primary']
      assert_equal expected_name, summary['collection_preview'].first['name']
      assert_equal 'Deutsche Beschreibung', summary['collection_preview'].first['notes']
    end
  end

  test 'collection previews follow target project permissions without exposing other projects' do
    project = new_project
    records = catalog_records(project)
    denied_project = new_project(workflow_state: 'unshared')
    catalog_records(denied_project)
    user = User.find_by!(email: 'john@example.com')
    permission = Permission.find_or_create_by!(klass: 'Collection', action_name: 'update')
    other_project = new_project
    role = Role.create!(project: other_project, name: 'Collection editor')
    RolePermission.create!(role: role, permission: permission)
    UserRole.create!(user: user, role: role)
    host! "#{other_project.shortname}.oral-history.localhost:47001"

    [nil, user].each do |account|
      login_as(account) if account
      get '/api/v2/projects', params: { all: true, include: 'counts,collection_preview' }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      assert_not_includes ids, denied_project.id
      summary = body['data'].find { |record| record['id'] == project.id }
      assert_equal [records[:collection].id], summary['collection_preview'].map { |record| record['id'] }
      assert_equal 1, summary['interview_counts']['unshared']
      assert_not_includes response.body, 'Secret notes'
    end

    role.update!(project: project)
    [user, User.find_by!(email: 'alice@example.com')].each do |account|
      login_as(account)
      get '/api/v2/projects', params: { all: true, include: 'collection_preview' }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      summary = body['data'].find { |record| record['id'] == project.id }
      assert_equal [records[:collection].id, records[:hidden].id].sort, summary['collection_preview'].map { |record| record['id'] }
    end
  end

  test 'included aggregates retain catalog rules for authorized unshared projects' do
    project = new_project(workflow_state: 'unshared')
    records = catalog_records(project)
    member = User.find_by!(email: 'john@example.com')
    membership = UserProject.create!(user: member, project: project)
    membership.update_column(:workflow_state, 'project_access_granted')

    [member, User.find_by!(email: 'alice@example.com')].each do |account|
      login_as(account)
      get '/api/v2/projects', params: { all: true, include: 'counts,interview_languages,collection_preview' }
      assert_response :success
      assert_api_response_schema('/api/v2/projects')
      summary = body['data'].find { |record| record['id'] == project.id }
      assert_equal 0, summary['interview_counts']['total']
      assert_equal 1, summary['collection_counts']['total']
      assert_equal [], summary['interview_languages']
      expected = account.admin? ? [records[:collection].id, records[:hidden].id].sort : [records[:collection].id]
      assert_equal expected, summary['collection_preview'].map { |record| record['id'] }
    end
  end

  test 'included data is batched and restricted to the returned page' do
    projects = 4.times.map { new_project }
    projects.each { |project| catalog_records(project) }
    show_only(*projects)
    includes = 'counts,institutions,interview_languages,collection_preview'
    list_queries(per_page: 1, include: includes, sort: 'id')
    small = list_queries(per_page: 1, include: includes, sort: 'id')
    assert_equal [projects.first.id], ids
    first_summary = body['data'].first
    large = list_queries(per_page: 100, include: includes, sort: 'id')
    assert_equal projects.map(&:id), ids
    assert_equal first_summary, body['data'].first
    assert_operator large.length, :<=, small.length + 2,
      "Queries grew from #{small.length} to #{large.length} with catalog includes"

    metric_queries = small.grep(/FROM [`"]?(?:interviews|interview_languages|collections)[`"]?\s/i)
    assert_equal 4, metric_queries.length
    metric_queries.each do |sql|
      assert_match(/project_id[`"]? = #{projects.first.id}\b/, sql)
    end
  end

  private

  def catalog_records(project)
    parent = Institution.create!(name: 'Parent institute', shortname: "parent#{SecureRandom.hex(3)}")
    institution = Institution.create!(name: 'Research institute', parent: parent, shortname: "inst#{SecureRandom.hex(3)}")
    InstitutionProject.create!(project: project, institution: institution, primary: true)
    collection = Collection.create!(project: project, institution: institution, name: 'Public collection', notes: 'Public notes', workflow_state: 'public')
    hidden = Collection.create!(project: project, institution: institution, name: 'Hidden collection', notes: 'Secret notes', workflow_state: 'unshared')
    %w[public restricted unshared].each_with_index do |state, index|
      interview = Interview.create!(project: project, collection: collection,
        archive_id: "#{project.shortname}#{format('%03d', index + 1)}", media_type: 'audio', workflow_state: state)
      InterviewLanguage.create!(interview: interview, language: Language.find_by!(code: 'eng'), spec: 'primary')
    end
    { institution: institution, parent: parent, collection: collection, hidden: hidden }
  end

  def new_project(**attributes)
    DataHelper.test_project(shortname: "v2#{SecureRandom.hex(3)}a", **attributes)
  end

  def show_only(*projects)
    Project.where.not(id: projects.map(&:id)).update_all(workflow_state: 'unshared')
  end

  def translate(project, locale, **attributes)
    project.translations.find_or_initialize_by(locale: locale).update!(attributes)
  end

  def list_queries(**parameters)
    queries = []
    subscriber = lambda do |*event|
      payload = event.last
      queries << payload[:sql] if payload[:name] != 'SCHEMA' && !payload[:cached] && payload[:sql].match?(/\ASELECT/i)
    end
    ActiveSupport::Notifications.subscribed(subscriber, 'sql.active_record') do
      get '/api/v2/projects', params: parameters
    end
    assert_response :success
    assert_api_response_schema('/api/v2/projects')
    queries
  end

  def body
    JSON.parse(response.body)
  end

  def ids
    body['data'].map { |project| project['id'] }
  end
end
