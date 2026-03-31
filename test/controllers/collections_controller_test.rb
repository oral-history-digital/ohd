require 'test_helper'
require 'securerandom'

class CollectionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
  end

  test 'should get collections payload for a given project' do
    project = DataHelper.test_project(shortname: "ca#{SecureRandom.hex(4)}a")
    institution = Institution.first

    collection = Collection.create!(
      project: project,
      institution: institution,
      name: 'Test collection',
      homepage: 'https://example.org',
      notes: 'Collection notes',
      responsibles: 'Alice Example',
      interviewers: 'Bob Example',
      countries: 'DE',
      workflow_state: 'public'
    )

    get collections_project_path(project, locale: 'en', format: :json)
    assert_response :success

    json = JSON.parse(response.body)
    assert json.key?('data')
    assert json.key?('project')

    data = json['data']
    assert data.is_a?(Array)
    assert_equal 1, data.length

    project_json = json['project']
    assert project_json.key?('id')
    assert project_json.key?('shortname')
    assert project_json.key?('name')
    assert project_json.key?('archive_domain')

    item = data.first
    assert_equal collection.id, item['id']
    assert_equal project.id, item['project_id']
    assert item.key?('name')
    assert item.key?('shortname')
    assert item.key?('homepage')
    assert item.key?('notes')
    assert item.key?('institution')
    assert item.key?('interviews')
    assert item.key?('countries')
    assert item.key?('interviewers')
    assert item.key?('responsibles')
    assert item.key?('publication_date')
    assert item.key?('workflow_state')
    assert item.key?('languages_interviews')

    assert item['interviews'].key?('public')
    assert item['interviews'].key?('restricted')
    assert item['interviews'].key?('unshared')
    assert item['interviews'].key?('total')
  end

  test 'should hide unshared project collections from anonymous users' do
    reset!
    host! 'test.portal.oral-history.localhost:47001'

    project = DataHelper.test_project(
      shortname: "cu#{SecureRandom.hex(4)}a",
      workflow_state: 'unshared'
    )

    Collection.create!(project: project, institution: Institution.first, name: 'Private collection')

    get collections_project_path(project, locale: 'en', format: :json)
    assert_response :not_found
  end

  test 'should allow admin to see unshared project collections' do
    project = DataHelper.test_project(
      shortname: "cv#{SecureRandom.hex(4)}a",
      workflow_state: 'unshared'
    )

    collection = Collection.create!(project: project, institution: Institution.first, name: 'Private collection')

    login_as User.find_by!(email: 'alice@example.com')
    get collections_project_path(project, locale: 'en', format: :json)
    assert_response :success

    data = JSON.parse(response.body).fetch('data', [])
    ids = data.map { |item| item['id'] }
    assert_includes ids, collection.id
  end

  test 'should return lightweight single collection payload in show when lite flag is set' do
    project = DataHelper.test_project(shortname: "cw#{SecureRandom.hex(4)}a")
    institution = Institution.first

    collection = Collection.create!(
      project: project,
      institution: institution,
      name: 'Lite collection',
      homepage: 'https://example.org',
      notes: 'Collection notes',
      responsibles: 'Alice Example',
      workflow_state: 'public'
    )

    Interview.create!(
      project: project,
      collection: collection,
      archive_id: "#{project.shortname}100",
      media_type: 'video',
      interview_date: '1980-01-01',
      workflow_state: 'public'
    )

    Interview.create!(
      project: project,
      collection: collection,
      archive_id: "#{project.shortname}101",
      media_type: 'audio',
      interview_date: '1981-01-01',
      workflow_state: 'public'
    )

    get collection_path(collection, locale: 'en', format: :json), params: { lite: 1 }
    assert_response :success

    body = JSON.parse(response.body)
    assert_equal collection.id, body['id']
    assert_equal 'collections', body['data_type']

    payload = body['data']
    assert payload.key?('name')
    assert payload.key?('project_id')
    assert payload.key?('project_name')
    assert payload.key?('is_linkable')
    assert payload.key?('interviews')
    assert payload.key?('num_interviews')
    assert payload.key?('media_types')
    assert payload.key?('languages_interviews')
    assert payload.key?('interview_year_range')
    assert payload.key?('birth_year_range')
    assert payload.key?('subjects')
    assert payload.key?('levels_of_indexing')

    assert payload['name'].is_a?(String)
    assert payload['project_name'].is_a?(String)
    assert payload['homepage'].is_a?(String)
    assert payload['notes'].is_a?(String)
    assert payload['responsibles'].is_a?(String)

    refute payload.key?('translations_attributes')
    refute payload.key?('type')
    refute payload.key?('interview_dates')
    refute payload.key?('birthdays')
    refute payload.key?('languages')

    assert_equal 2, payload.dig('interviews', 'total')
    assert_equal 2, payload.dig('interviews', 'public')
    assert_equal 0, payload.dig('interviews', 'restricted')
    assert_equal 0, payload.dig('interviews', 'unshared')
    assert_equal 1, payload.dig('media_types', 'video')
    assert_equal 1, payload.dig('media_types', 'audio')
    assert_equal 1980, payload.dig('interview_year_range', 'min')
    assert_equal 1981, payload.dig('interview_year_range', 'max')
  end

  test 'should only count interviews from public projects in lite collection payload' do
    public_project = DataHelper.test_project(
      shortname: "cup#{SecureRandom.hex(3)}a",
      workflow_state: 'public'
    )

    unshared_project = DataHelper.test_project(
      shortname: "cup#{SecureRandom.hex(3)}b",
      workflow_state: 'unshared'
    )

    institution = Institution.first

    collection = Collection.create!(
      project: public_project,
      institution: institution,
      name: 'Test collection with multiple projects'
    )

    # Create 2 interviews in public project
    Interview.create!(
      project: public_project,
      collection: collection,
      archive_id: "#{public_project.shortname}100",
      media_type: 'video',
      interview_date: '2020-01-01',
      workflow_state: 'public'
    )

    Interview.create!(
      project: public_project,
      collection: collection,
      archive_id: "#{public_project.shortname}101",
      media_type: 'audio',
      interview_date: '2021-01-01',
      workflow_state: 'public'
    )

    # Create interview in unshared project - should NOT be counted
    Interview.create!(
      project: unshared_project,
      collection: collection,
      archive_id: "#{unshared_project.shortname}100",
      media_type: 'video',
      interview_date: '2022-01-01',
      workflow_state: 'public'
    )

    get collection_path(collection, locale: 'en', format: :json), params: { lite: 1 }
    assert_response :success

    body = JSON.parse(response.body)
    payload = body['data']

    # Should only count interviews from the public project
    assert_equal 2, payload.dig('interviews', 'total')
    assert_equal 2, payload.dig('interviews', 'public')
    assert_equal 0, payload.dig('interviews', 'restricted')
    assert_equal 0, payload.dig('interviews', 'unshared')
    
    # Only public project interviews should be in media types
    assert_equal 1, payload.dig('media_types', 'video')
    assert_equal 1, payload.dig('media_types', 'audio')
  end
end
