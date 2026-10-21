# Shared real-record setup for project-loading preservation and improvement tests.
module ProjectLoadingHelper
  include ActiveJob::TestHelper
  # Builds distinct projects without the legacy fixture's portal/domain collision.
  def setup_project_loading_records
    @portal = Project.find_by!(shortname: 'ohd')
    @portal.update!(available_locales: %w[en de])
    Project.find_by!(shortname: 'test').update!(archive_domain: nil)
    @alpha = DataHelper.test_project(shortname: 'alpha', archive_domain: nil,
      name: 'Alpha Archive', available_locales: %w[en de], display_ohd_link: true,
      primary_color: '#123456', secondary_color: '#654321', default_search_order: 'archive_id')
    @beta = DataHelper.test_project(shortname: 'beta', archive_domain: nil,
      name: 'Beta Archive', available_locales: %w[en], display_ohd_link: true, primary_color: '#abcdef')
    @dedicated = DataHelper.test_project(shortname: 'dedicated',
      archive_domain: 'http://coverage.localhost:47001', name: 'Dedicated Archive',
      available_locales: %w[en de], display_ohd_link: true)
    Globalize.with_locale(:de) { @alpha.update!(name: 'Alpha Archiv') }
    Globalize.with_locale(:de) { @dedicated.update!(name: 'Eigenes Archiv') }
    @admin = User.find_by!(email: 'alice@example.com')
    @reader = User.find_by!(email: 'john@example.com')
    [@beta, @alpha, @dedicated].each { |project| DataHelper.grant_access(project, @admin, workflow_state: 'project_access_granted') }
    DataHelper.grant_access(@alpha, @reader, workflow_state: 'project_access_granted')
    FileUtils.mkdir_p(Rails.root.join('tmp/files'))
    Rails.cache.clear
  end

  # Waits for the real project footer and theme, excluding another project's branding.
  def assert_project_presentation(project, locale: 'en', prefix: "/#{project.shortname}/#{locale}")
    name = project.name(locale)
    assert_selector 'footer', text: name, wait: 15
    assert_selector "footer a[href$='#{prefix}/contact']"
    assert_selector "footer a[href$='#{prefix}/legal_info']"
    assert_selector 'nav[aria-label="breadcrumb"]', text: name unless project.umbrella?
    assert_equal project.primary_color, page.evaluate_script(
      "getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()")
    assert_no_selector 'footer', text: @beta.name if project.id != @beta.id
  end

  # Marks the current document so later assertions detect an unintended full reload.
  def mark_project_document
    page.execute_script("window.projectLoadingDocument = 'same-document'")
  end

  # Asserts that React navigation or saving preserved the browser document.
  def assert_same_project_document
    assert_equal 'same-document', page.evaluate_script('window.projectLoadingDocument')
  end

  # Selects by the real option value, independently of translated labels.
  def select_project_loading_value(selector, value)
    find(selector).find("option[value='#{value}']").select_option
  end

  # Finds the active administration row after the real server response arrives.
  def project_loading_user_row(email = @reader.email)
    find('tbody tr', text: email, wait: 15)
  end

  # Opens the actual pencil dialog rather than the older user administration UI.
  def open_project_loading_user_dialog
    project_loading_user_row.find("button[title='#{TranslationValue.for('modules.tables.edit', :en)}']").click
    assert_selector '[data-reach-dialog-content] .UserEdit', wait: 10
  end

  # Enables editing on the loaded React page, retaining its Redux edit-mode state.
  def enable_project_loading_editing
    click_on 'Editing interface'
    assert_text 'Administration'
  end

  # Opens the existing users table through the real administration navigation.
  def open_project_loading_users(project = @alpha)
    visit(project.umbrella? ? '/en' : "/#{project.shortname}/en")
    enable_project_loading_editing
    click_on 'Administration'
    click_on 'Users'
    assert_selector '.UserTable', wait: 15
  end

  # Opens an archive form through navigation so EditViewOrRedirect retains edit mode.
  def open_project_loading_configuration(title)
    visit '/alpha/en'
    enable_project_loading_editing
    click_on 'Archive configuration'
    click_on title
  end

  # Creates a public interview with an unambiguous title and archive identifier.
  def project_loading_interview(project, number, media_type: 'audio')
    person = Person.create!(project: project, first_name: "Person#{number}", last_name: project.shortname.capitalize)
    type = project.contribution_types.find_by(code: 'interviewee') || DataHelper.test_contribution_type(project)
    interview = Interview.create!(project: project, archive_id: "#{project.shortname}#{format('%03d', number)}",
      media_type: media_type,
      interview_languages: [InterviewLanguage.new(language: Language.find_by!(code: 'eng'), spec: 'primary')],
      contributions: [Contribution.new(person: person, contribution_type: type)])
    interview.update_column(:workflow_state, 'public')
    interview
  end
end
