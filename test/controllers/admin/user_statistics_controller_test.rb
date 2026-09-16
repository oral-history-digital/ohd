require 'test_helper'

class Admin::UserStatisticsControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
    @umbrella = DataHelper.test_project(shortname: "umb#{SecureRandom.hex(2)}a")
    InstanceSetting.current.update!(umbrella_project: @umbrella)
  end

  test 'umbrella statistics exclude configured umbrella and retain former ohd archive' do
    member = User.find_by!(email: 'john@example.com')
    archive = Project.find_by!(shortname: 'ohd')
    [@umbrella, archive].each do |project|
      access = UserProject.create!(user: member, project: project)
      access.update_columns(activated_at: Time.current)
    end
    token = Doorkeeper::AccessToken.create!(
      resource_owner_id: User.find_by!(email: 'alice@example.com').id
    ).token

    get "/#{@umbrella.shortname}/en/admin/user_statistics.csv",
      params: { access_token: token }

    assert_response :success
    rows = CSV.parse(response.body, **CSV_OPTIONS)
    labels = rows.map(&:first)
    assert_includes labels, archive.shortname
    assert_not_includes labels, @umbrella.shortname
    assert_equal User.where.not(confirmed_at: nil).count, rows[1][1].to_i

    get '/ohd/en/admin/user_statistics.csv', params: { access_token: token }
    assert_response :success
    archive_rows = CSV.parse(response.body, **CSV_OPTIONS)
    assert_equal 1, archive_rows[1][1].to_i
  end

  test 'statistics reject non-admin users without permissions' do
    token = Doorkeeper::AccessToken.create!(
      resource_owner_id: User.find_by!(email: 'john@example.com').id
    ).token

    get "/#{@umbrella.shortname}/en/admin/user_statistics.csv",
      params: { access_token: token }

    assert_response :redirect
    assert_match '/users/sign_in', response.location
  end
end
