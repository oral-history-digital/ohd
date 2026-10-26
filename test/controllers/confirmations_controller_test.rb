require 'test_helper'

class ConfirmationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
    @user = User.find_by!(email: 'john@example.com')
    @token, encrypted_token = Devise.token_generator.generate(User, :confirmation_token)
    @user.update_columns(
      confirmed_at: nil,
      confirmation_token: encrypted_token,
      confirmation_sent_at: Time.current,
      workflow_state: 'created',
      default_locale: 'en'
    )
  end

  test 'confirmation preserves search sorting and drops session tokens and fragments' do
    confirm_at('http://test.portal.oral-history.localhost:47001/en/searches/archive?sort=random&order=desc&checked_ohd_session=true&access_token=old-token&next=https%3A%2F%2Fevil.example#private')

    assert_redirected_to 'http://test.portal.oral-history.localhost:47001/en/searches/archive?order=desc&sort=random'
    get '/en/users/current.json'
    assert_equal @user.id, JSON.parse(response.body).fetch('data').fetch('id')
  end

  test 'confirmation preserves sorting on relative shared archive paths' do
    confirm_at('/ohd/en/searches/archive?sort=archive_id&order=asc&checked_ohd_session=true')

    assert_redirected_to '/ohd/en/searches/archive?order=asc&sort=archive_id'
  end

  test 'confirmation preserves sorting for a configured dedicated archive host' do
    project = DataHelper.test_project(shortname: 'confirmation', archive_domain: 'https://confirmation.example')
    confirm_at("#{project.archive_domain}/en/searches/archive?sort=title&checked_ohd_session=true")

    assert_redirected_to 'https://confirmation.example/en/searches/archive?sort=title'
  end

  test 'confirmation falls back for an untrusted host' do
    confirm_at('https://evil.example/en/searches/archive?sort=random')

    assert_redirected_to '/en'
  end

  test 'confirmation drops query parameters on other destinations' do
    confirm_at('/en/users/sign_in?sort=random&path=https%3A%2F%2Fevil.example#private')

    assert_redirected_to '/en/users/sign_in'
  end

  test 'confirmation drops ambiguous sorting parameters' do
    confirm_at('/en/searches/archive?sort=random&sort=title&order[]=desc')

    assert_redirected_to '/en/searches/archive'
  end

  test 'confirmation falls back for malformed URLs' do
    confirm_at('http://[invalid')

    assert_redirected_to '/en'
  end

  test 'confirmation rejects unsupported URL schemes on a trusted host' do
    confirm_at('ftp://test.portal.oral-history.localhost:47001/en/searches/archive?sort=random')

    assert_redirected_to '/en'
  end

  private

  # Confirms a real account through Devise and checks persisted activation.
  def confirm_at(location)
    @user.update_columns(pre_register_location: location)
    get '/en/users/confirmation', params: { confirmation_token: @token }

    assert_response :redirect
    assert @user.reload.confirmed?
    assert_equal 'afirmed', @user.workflow_state
  end
end
