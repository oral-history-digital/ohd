require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
    @access_token = Doorkeeper::AccessToken.create!(
      resource_owner_id: User.find_by!(email: 'alice@example.com').id
    ).token
  end

  test 'ignores invalid default locale filter values' do
    users_json(page: 1, workflow_state: 'afirmed')
    assert_response :success
    unfiltered_total = JSON.parse(response.body).fetch('total')

    users_json(
      page: 1,
      workflow_state: 'afirmed',
      default_locale: 'all'
    )
    assert_response :success
    assert_equal unfiltered_total, JSON.parse(response.body).fetch('total')

    users_json(
      page: 1,
      workflow_state: 'afirmed',
      default_locale: 'not-a-locale'
    )
    assert_response :success
    assert_equal unfiltered_total, JSON.parse(response.body).fetch('total')
  end

  test 'allows global user locales not available on umbrella project' do
    assert_not_includes Project.find_by!(shortname: 'ohd').available_locales, 'ru'

    user = User.new(
      login: 'russian-user@example.com',
      email: 'russian-user@example.com',
      password: 'Password123!',
      password_confirmation: 'Password123!',
      first_name: 'Russian',
      last_name: 'User',
      tos_agreement: true,
      tos_agreed_at: DateTime.now,
      priv_agreement: true,
      country: 'Germany',
      street: 'Test Street 1',
      city: 'Berlin',
      default_locale: 'ru'
    )
    user.skip_confirmation_notification!
    user.save!
    user.confirm
    user.afirm!

    users_json(
      page: 1,
      workflow_state: 'afirmed',
      default_locale: 'ru'
    )
    assert_response :success

    user_ids = JSON.parse(response.body).
      fetch('data').
      map { |payload| payload.fetch('id') }
    assert_includes user_ids, user.id
  end

  private

  def users_json(params)
    get '/ohd/en/users.json', params: params.merge(access_token: @access_token)
  end
end
