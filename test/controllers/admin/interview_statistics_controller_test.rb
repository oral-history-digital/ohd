require 'test_helper'

class Admin::InterviewStatisticsControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
  end

  test 'should export interview statistics csv for admin' do
    login_as User.find_by!(email: 'alice@example.com')

    get admin_interview_statistics_path(locale: 'de', format: :csv)

    assert_response :success
    assert_includes response.headers['Content-Disposition'], '.csv'
    assert_includes response.body, 'workflow_state'
    assert_includes response.body, 'media_type'
  end

  test 'should reject non admin user' do
    login_as User.find_by!(email: 'john@example.com')

    get admin_interview_statistics_path(locale: 'de', format: :csv)

    assert_response :redirect
    assert_match '/users/sign_in', response.location
  end
end
