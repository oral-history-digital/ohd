require 'test_helper'

class UnauthorizedLocaleTest < ActionDispatch::IntegrationTest
  # The failure app recalls :locale from the path parameters of the attempted
  # request. Paths outside scope "/:locale" (doorkeeper's /oauth/*, mounted
  # engines) have none, so the redirect to the sign-in page has to supply it.
  test 'unauthenticated html request without a locale segment redirects to the sign-in page' do
    # ApplicationController#set_locale falls back to the default locale when the
    # path carries none, and warden hands off to the failure app with it still set.
    status, headers, _body = I18n.with_locale(I18n.default_locale) do
      call_failure_app('/oauth/authorize')
    end

    assert_equal 302, status
    assert_equal(
      new_user_session_url(locale: I18n.default_locale, host: 'test.host'),
      headers.to_h.transform_keys(&:downcase)['location']
    )
  end

  private

  # The failure app runs without the session middleware, but store_location!
  # and the flash alert still expect a session that reports its own state.
  class SessionDouble < Hash
    def enabled?
      true
    end

    def loaded?
      true
    end
  end

  # Warden invokes the failure app as a bare rack endpoint, so there is no
  # routing pass and path_parameters stays empty.
  def call_failure_app(path)
    env = Rack::MockRequest.env_for(
      path,
      'HTTP_HOST' => 'test.host',
      'REQUEST_METHOD' => 'GET',
      'rack.session' => SessionDouble.new,
      'action_dispatch.request.formats' => [Mime[:html]],
      'warden' => Struct.new(:message).new(nil),
      'warden.options' => { scope: :user, attempted_path: path }
    )

    UnauthorizedController.call(env)
  end
end
