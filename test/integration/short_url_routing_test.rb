require 'test_helper'

# Regression tests for the short, single-segment URLs on the OHD portal domain.
#
# Valid short URLs are only:
#   * /de and /en          -> portal homepage (projects#index)
#   * /<project-shortname>  -> redirect to /<project-shortname>/<default_locale>
#
# Anything else (bots hitting /sitemap.xml, /testscript.php, …) must return 404,
# not 500. See config/routes.rb (OHD_DOMAIN block).
class ShortUrlRoutingTest < ActionDispatch::IntegrationTest
  setup do
    host! 'test.portal.oral-history.localhost:47001'
  end

  test 'portal homepage is served for the de and en locales' do
    get '/de'
    assert_response :success

    get '/en'
    assert_response :success
  end

  test 'a known project shortname redirects to its default locale' do
    # The seeded test project has shortname "test" and default_locale "en".
    get '/test'
    assert_redirected_to '/test/en'
  end

  test 'unknown short urls return 404 instead of 500' do
    # Note: real static files in public/ (e.g. robots.txt, favicon.ico) are
    # served before routing and are intentionally not covered here.
    ['/sitemap.xml', '/testscript.php', '/wp-login.php'].each do |path|
      get path
      assert_response :not_found,
        "expected 404 for #{path}, got #{response.status}"
    end
  end
end
