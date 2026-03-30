module RedirectSystemTestHelper
  def setup_redirect_project_for_user(email:)
    project = DataHelper.test_project(
      shortname: 'redirproj',
      archive_domain: 'http://redirectproject.localhost:47001',
      name: 'Redirect Project',
      introduction: 'Redirect intro',
      more_text: 'Redirect more text',
      landing_page_text: 'Redirect project landing page'
    )
    DataHelper.test_registry(project)
    DataHelper.test_contribution_type(project)

    user = User.find_by(email: email)
    DataHelper.grant_access(project, user)

    project
  end

  def assert_redirected_to_project_subpage
    redirected_url = URI.parse(current_url)
    redirected_query = Rack::Utils.parse_nested_query(redirected_url.query)

    assert_equal 'redirectproject.localhost', redirected_url.host
    assert_equal '/en/searches/archive', redirected_url.path
    assert_equal 'random', redirected_query['sort']
    assert_nil redirected_query['checked_ohd_session']
    assert_text 'Redirect Project'
  end
end