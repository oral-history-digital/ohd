require 'test_helper'
require 'securerandom'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
  end

  test 'should hide unshared projects in index all mode for anonymous users' do
    reset!
    host! 'test.portal.oral-history.localhost:47001'

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

end
