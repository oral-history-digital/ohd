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
end
