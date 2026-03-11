require 'test_helper'
require 'securerandom'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  test 'should get lightweight archives payload with pagination metadata' do
    get "#{root_url}/en/projects/archives.json?page=1"
    assert_response :success

    data = JSON.parse(response.body)
    assert data.key?('data')
    assert data.key?('page')
    assert data.key?('result_pages_count')

    data = data['data']
    assert data.is_a?(Array)
    assert data.any?

    archive = data.first

    assert archive.key?('id')
    assert archive.key?('name')
    assert archive.key?('display_name')
    assert archive.key?('shortname')
    assert archive.key?('archive_domain')
    assert archive.key?('latitude')
    assert archive.key?('longitude')
    assert archive.key?('introduction')
    assert archive.key?('more_text')
    assert archive.key?('institutions')
    assert archive.key?('interviews')
    assert archive.key?('collections')
    assert archive.key?('logo')
    assert archive.key?('workflow_state')
    assert archive.key?('available_locales')
    assert archive.key?('has_map')
    assert archive.key?('is_catalog')
    assert archive.key?('has_newsletter')
    assert archive.key?('publication_date')

    assert archive['interviews'].key?('public')
    assert archive['interviews'].key?('restricted')
    assert archive['interviews'].key?('unshared')
    assert archive['interviews'].key?('total')

    assert archive['collections'].key?('public')
    assert archive['collections'].key?('restricted')
    assert archive['collections'].key?('total')
  end

  test 'should support all option for archives payload' do
    get "#{root_url}/en/projects/archives.json?all=true"
    assert_response :success

    data = JSON.parse(response.body)
    assert data.key?('data')
    assert_nil data['page']
    assert_nil data['result_pages_count']
    assert data['data'].is_a?(Array)
  end

  test 'should hide unshared projects in index all mode for anonymous users' do
    reset!

    unshared_project = DataHelper.test_project(
      shortname: "us#{SecureRandom.hex(4)}i",
      workflow_state: 'unshared'
    )

    get "#{root_url}/en/projects.json?all=true"
    assert_response :success

    data = JSON.parse(response.body)
    project_ids = data.fetch('data', {}).keys
    assert_not_includes project_ids, unshared_project.id.to_s
  end

  test 'should allow admin to see unshared projects in index all mode' do
    unshared_project = DataHelper.test_project(
      shortname: "us#{SecureRandom.hex(4)}j",
      workflow_state: 'unshared'
    )

    login_as User.find_by!(email: 'alice@example.com')
    get "#{root_url}/en/projects.json?all=true"
    assert_response :success

    data = JSON.parse(response.body)
    project_ids = data.fetch('data', {}).keys
    assert_includes project_ids, unshared_project.id.to_s
  end

  test 'should hide unshared projects for anonymous users when filtering by workflow_state' do
    reset!

    DataHelper.test_project(
      shortname: "us#{SecureRandom.hex(4)}a",
      workflow_state: 'unshared'
    )

    get "#{root_url}/en/projects/archives.json?workflow_state=unshared&all=true"
    assert_response :success

    data = JSON.parse(response.body)
    assert_equal [], data['data']
  end

  test 'should allow admin users to see unshared projects when filtering by workflow_state' do
    unshared_project = DataHelper.test_project(
      shortname: "us#{SecureRandom.hex(4)}b",
      workflow_state: 'unshared'
    )

    login_as User.find_by!(email: 'alice@example.com')
    get "#{root_url}/en/projects/archives.json?workflow_state=unshared&all=true"
    assert_response :success

    data = JSON.parse(response.body)
    ids = data['data'].map { |project| project['id'] }
    assert_includes ids, unshared_project.id
  end
end
