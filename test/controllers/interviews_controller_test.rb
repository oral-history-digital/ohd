require 'test_helper'

class InterviewsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @project = nil
    @interview = nil
  end

  def project
    @project ||= Project.first
  end

  def interview
    @interview ||= project.interviews.first
  end

  test "should get show" do
    get "#{root_url}/en/interviews/#{interview.archive_id}.json"
    assert_response :success
    data = JSON.parse(response.body)

    assert 'test123', data['archive_id']
  end

  test 'should use auth for observations' do
    url = "#{root_url}/en/interviews/#{interview.archive_id}/observations.json"
    get url
    assert_response :unauthorized

    user = User.find_by!(login: 'alice@example.com')
    user.confirm! unless user.confirmed?
    sign_in user
    get url
    assert_response :success
  end
end
