require 'securerandom'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
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
