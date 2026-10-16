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
  #
  # @param location [String] Originating page URL
  # @return [void]
  def confirm_at(location)
    @user.update_columns(pre_register_location: location)
    get '/en/users/confirmation', params: { confirmation_token: @token }

    assert_response :redirect
    assert @user.reload.confirmed?
    assert_equal 'afirmed', @user.workflow_state
  end
end

# Exercises invalid return URLs without confirming the same account repeatedly.
class ConfirmationReturnPathTest < ActionController::TestCase
  tests ConfirmationsController
  setup do
    @request.host = 'test.portal.oral-history.localhost'
    @user = Struct.new(:default_locale, :pre_register_location).new('de', nil)
  end

  test 'confirmation returns to the originating search with its filters' do
    @user.pre_register_location = 'http://test.portal.oral-history.localhost:47001/en/searches/archive?sort=random'

    assert_equal @user.pre_register_location, confirmation_return_path
  end

  test 'relative return paths preserve filters and remove internal flags tokens and fragments' do
    @user.pre_register_location = '/de/searches/archive?sort=random&checked_ohd_session=true&access_token=old&confirmation_token=old&reset_password_token=old#fragment'

    assert_equal '/de/searches/archive?sort=random', confirmation_return_path
  end

  test 'trusted project domains preserve filters without authentication parameters' do
    Project.find_by!(shortname: 'test').update!(archive_domain: 'https://archive.example')
    @user.pre_register_location = 'https://archive.example/test/de/searches/archive?sort=random&checked_ohd_session=true&access_token=old#fragment'

    assert_equal 'https://archive.example/test/de/searches/archive?sort=random', confirmation_return_path
  end

  test 'untrusted hosts unsafe schemes and embedded credentials fall back to the user locale' do
    [
      'https://untrusted.example/de/searches/archive?sort=random',
      '//untrusted.example/de/searches/archive',
      'javascript:/de/searches/archive',
      'http:/untrusted.example/de/searches/archive',
      'ftp://test.portal.oral-history.localhost/de/searches/archive',
      'https://name:password@test.portal.oral-history.localhost/de/searches/archive',
      'http://[invalid',
      'relative/path',
    ].each do |path|
      @user.pre_register_location = path
      assert_equal '/de', confirmation_return_path, path
    end
  end

  test 'empty and malformed query return paths fall back without raising' do
    [nil, '', '/de/searches/archive?filter=x&filter[name]=y', '/de/searches/archive?sort=%ZZ',
      "/de/searches/archive?filter#{'[name]' * 40}=value"].each do |path|
      @user.pre_register_location = path
      assert_equal '/de', confirmation_return_path
    end
  end

  test 'a return path with only internal parameters has no empty query string' do
    @user.pre_register_location = '/de/searches/archive?checked_ohd_session=true&access_token=old'

    assert_equal '/de/searches/archive', confirmation_return_path
  end

  private

  # Resolves the return path for the test account without running confirmation.
  #
  # @return [String] Sanitized destination or locale fallback
  def confirmation_return_path
    @controller.send(:after_confirmation_path_for, :user, @user)
  end
end
