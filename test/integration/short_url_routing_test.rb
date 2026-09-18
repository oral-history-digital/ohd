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

  test 'configured umbrella serves portal while former ohd serves its archive domain' do
    umbrella = DataHelper.test_project(
      shortname: "umb#{SecureRandom.hex(2)}a",
      archive_domain: OHD_DOMAIN
    )
    InstanceSetting.current.update!(umbrella_project: umbrella)
    # Shared fixtures originally use the same domain. Give archives distinct
    # domains so current_project can resolve the configured portal unambiguously.
    Project.find_by!(shortname: 'test').update!(archive_domain: 'http://ordinary-archive.localhost:47001')
    Project.find_by!(shortname: 'ohd').update!(archive_domain: 'http://legacy-archive.localhost:47001')

    get '/en'
    assert_response :success
    assert_equal 'index', request.path_parameters[:action]

    host! 'legacy-archive.localhost:47001'
    # Bypass the existing central-session check to test archive route selection.
    get '/en', params: { checked_ohd_session: true }
    assert_response :success
    assert_equal 'show', request.path_parameters[:action]
  end
end
