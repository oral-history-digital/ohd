require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
    @umbrella = DataHelper.test_project(
      shortname: "umb#{SecureRandom.hex(2)}a",
      archive_domain: 'http://umbrella.localhost:47001'
    )
    InstanceSetting.current.update!(umbrella_project: @umbrella)
    @archive = Project.find_by!(shortname: 'ohd')
    @archive.update!(archive_domain: 'http://legacy-archive.localhost:47001')
    @user = User.find_by!(email: 'john@example.com')
    @user.update!(otp_required_for_login: false, passkey_required_for_login: false)
    @token = Doorkeeper::AccessToken.create!(resource_owner_id: @user.id).token
  end

  test 'sign-in without a project falls back to configured umbrella' do
    get '/en/users/sign_in'
    assert_response :success

    sign_in_to_project

    assert_response :redirect
    assert_redirected_to "#{@umbrella.archive_domain}/en?access_token=#{@token}"
  end

  test 'sign-in with an unknown project falls back to configured umbrella' do
    sign_in_to_project(project: 'unknown')

    assert_redirected_to "#{@umbrella.archive_domain}/en?access_token=#{@token}"
  end

  test 'explicit former ohd archive keeps redirect path and token handover' do
    sign_in_to_project(
      project: @archive.shortname,
      path: '/en/searches/archive?sort=random&checked_ohd_session=true'
    )

    assert_response :redirect
    redirect_uri = URI.parse(response.location)
    query = Rack::Utils.parse_nested_query(redirect_uri.query)
    assert_equal URI.parse(@archive.archive_domain).host, redirect_uri.host
    assert_equal '/en/searches/archive', redirect_uri.path
    assert_equal 'random', query['sort']
    assert_equal @token, query['access_token']
    assert_not query.key?('checked_ohd_session')
  end

  private

  def sign_in_to_project(params = {})
    post '/en/users/sign_in', params: {
      user: { email: @user.email, password: 'Password123!' },
      path: '/en'
    }.merge(params)
  end
end
