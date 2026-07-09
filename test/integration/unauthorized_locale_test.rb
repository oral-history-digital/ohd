require 'test_helper'

class UnauthorizedLocaleTest < ActionDispatch::IntegrationTest
  # photos#src is one of the few authenticated routes outside scope "/:locale",
  # so the failure app has no locale to recall from the request path.
  test 'unauthenticated html request without a locale segment redirects to the sign-in page' do
    get '/photos/src/some-photo'

    assert_redirected_to new_user_session_url(locale: I18n.default_locale)
  end
end
