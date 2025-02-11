require "application_system_test_case"

class BasicsTest < ApplicationSystemTestCase
  test 'transactional fixtures 1/2' do
    assert_equal 2, Project.count
    Project.create!(shortname: 'xyz')
    assert_equal 3, Project.count
  end

  test 'transactional fixtures 2/2' do
    assert_equal 2, Project.count
    Project.create!(shortname: 'xyz')
    assert_equal 3, Project.count
  end

  test "visiting the project 'home' page" do
    visit '/'
    assert_text 'This is the test archive of the oral history digital project'
  end

  test "login as admin" do
    visit '/'
    login_as 'alice@example.com'

    assert_text 'Logged in as Alice Henderson'
  end

  test "register as a new user" do
    visit '/'

    # step 1 - basic data
    click_on 'Registration'
    fill_in 'First Name', with: 'Mario'
    fill_in 'Last Name', with: 'Rossi'
    select 'Germany'
    fill_in 'Street', with: 'Am Dornbusch 13'
    fill_in 'City', with: 'Frankfurt am Main'
    fill_in 'Email', with: 'mrossi@example.com'
    fill_in 'Password', name: 'password', with: 'password'
    fill_in 'Password confirmation', with: 'password'
    check 'Terms of Use', visible: :all
    check 'Privacy Policy', visible: :all
    assert_text 'I agree to the Terms of Use of the Oral-History.Digital platform.'
    assert_text 'I agree to the Privacy Policy of the Freie Universität Berlin.'
    click_on 'Submit registration'
    assert_text 'Your registration has been successfully submitted!'

    # click link in mail
    mails = ActionMailer::Base.deliveries
    assert_equal 1, mails.count
    confirmation = mails.last
    assert_match /Confirmation of your registration/, confirmation.subject
    link = links_from_email(confirmation)[0]
    visit link

    # step 2 - activation request
    fill_in 'Institution', with: 'Goethe University'
    select 'Researcher'
    select 'Education'
    fill_in 'specification', with: 'project ...'
    check 'Terms of Use', visible: :all
    click_on 'Submit activation request'
    assert_text 'Your activation request has been successfully submitted'
    click_on 'OK'
    click_on 'Logout'

    # step 3 - activate user as admin
    login_as 'alice@example.com'
    mails = ActionMailer::Base.deliveries
    assert_equal 2, mails.count
    request = mails.last
    assert_match /request for review/, request.subject
    link = links_from_email(request)[0]
    visit link
    click_on 'Editing interface'
    click_on 'Edit item'
    select 'Activate'
    assert_text '<p>Hello Mario Rossi,</p><p>You now have access to the application'
    click_on 'Submit'
    click_button 'Account'
    Capybara.reset_sessions!

    # # enjoy ...
    visit '/'
    login_as 'mrossi@example.com'
    assert_text 'Logged in as Mario Rossi'
  end

  test 'request archive access' do
    visit '/'
    login_as 'john@example.com'

    assert_text 'The test archive'
    assert_text 'Please apply for activation'
    click_on 'Request activation for this archive'

    fill_in 'Institution', with: 'Nowhere University'
    select 'Student'
    select 'School project'
    fill_in 'Specification of research intention', with: 'details details'
    check 'Terms of Use', visible: :all
    click_on 'Submit activation request'
    assert_text 'Your request is now being processed'

    Capybara.reset_sessions!
    login_as 'alice@example.com'
    mails = ActionMailer::Base.deliveries
    assert_equal 1, mails.count
    request = mails.last
    assert_match /New activation request for review/, request.subject
    link = links_from_email(request)[0]
    visit link
    click_on 'Editing interface'
    click_on 'Edit item'
    select 'Activate'
    click_on 'Submit'
    assert_text 'activated'

    john = User.where(email: 'john@example.com').first
    assert !john.user_projects.last.mail_text.blank?

    Capybara.reset_sessions!
    login_as 'john@example.com'
    assert_text 'The test archive'
    assert_no_text 'Please apply for activation'
  end

  test 'validate inputs on archive access request' do
    visit '/'
    login_as 'john@example.com'

    assert_text 'The test archive'
    assert_text 'Please apply for activation'
    click_on 'Request activation for this archive'

    # the following fields should not be filled to trigger validation errors:
    #fill_in 'Institution', with: 'Nowhere University'
    #select 'Student'
    #select 'School project'
    #fill_in 'Specification of research intention', with: 'details details'
    #check 'Terms of Use', visible: :all
    click_on 'Submit activation request'
    assert_text 'Institution: Please fill'
    assert_text 'Occupation: Please select'
    assert_text 'Research Intention: Please select'
    assert_text 'Specification of research intention: Please fill'
    assert_text 'Terms of Use: Please agree'
  end

  test 'create interview' do
    visit '/'
    login_as 'alice@example.com'

    click_on 'Editing interface'
    click_on 'Curation'
    click_on 'Create new interview'
    click_on 'Add Contributor'
    select 'Dupont, Jean'
    select 'Interviewee'
    fill_in 'Interview ID', with: 'test234'
    select 'Audio'
    select 'English', from: 'primary_language_id'
    select 'English', from: 'secondary_language_id'
    select 'English', from: 'primary_translation_language_id'
    fill_in 'Number of tapes', with: 1
    within '#interview' do
      click_on 'Create new interview'
    end
    assert_text 'The interview has been created.'
  end

  test 'domain login' do
    project = DataHelper.test_project(
      shortname: 'myproject',
      archive_domain: 'http://myproject.localhost:47001',
      name: 'My Project',
      introduction: 'Just another project',
      more_text: 'more text, more text',
      landing_page_text: "This my project's is the landing page. Register please."
    )
    DataHelper.test_registry(project)
    DataHelper.test_contribution_type(project)

    user = User.find_by(email: 'john@example.com')
    DataHelper.grant_access(project, user)

    interview = Interview.create!(
      project_id: project.id,
      archive_id: 'myproject456',
      media_type: 'audio'
    )

    visit 'http://myproject.localhost:47001'
    assert_text 'My Project'

    # log in without returning to page root
    within '.flyout-login-container' do
      click_on 'Login'
    end
    fill_in 'Email', with: 'john@example.com'
    fill_in 'Password', with: 'password'
    click_on 'Login'

    assert_text 'My Project'
  end

  test 'search in and across archives' do
    Interview.reindex
    Segment.reindex
    DataHelper.test_media

    visit '/'
    login_as 'alice@example.com'
    click_on 'Search the archive'

    within '#archiveSearchForm' do
      fill_in with: 'nonsense'
      click_button 'Search the archive'
    end

    assert_no_text 'Rossi, Mario'

    within '#archiveSearchForm' do
      fill_in with: 'rossi'
      click_button 'Search the archive'
    end

    assert_text 'Rossi, Mario'

    click_on 'Rossi, Mario'
    click_on '1 Search results in transcript'

    assert_text 'My name is Mario Rossi'

    # The following does not work with Github Actions right now:
    #click_on 'My name is Mario Rossi'

    #within '.MediaPlayer' do
    #  assert_text '17:12'
    #end
  end

  test 'download transcript PDF' do
    Interview.reindex
    DataHelper.test_media

    visit '/'
    login_as 'alice@example.com'
    click_on 'Search the archive'
    click_on 'Rossi, Mario'
    click_on 'About the interview'
    click_on 'eng'

    # -> no error, we are happy
  end

  test 'change password' do
    visit '/'
    click_on 'Recover password'
    fill_in 'Email', with: 'john@example.com'
    click_on 'Submit'
    assert_text 'You have been sent an email with instructions on how to change your password.'

    mail = ActionMailer::Base.deliveries.last
    assert_match /Oral-History.Digital. Steps to recover your password./, mail.subject
    link = links_from_email(mail)[0]
    visit link
    fill_in 'password', with: 'newpassword'
    fill_in 'password_confirmation', with: 'newpassword'
    click_on 'Submit'
    assert_text 'This is the test archive of the oral history digital project'

  end

  test 'bookmarking segments' do
    Interview.reindex
    DataHelper.test_media

    visit '/'
    login_as 'alice@example.com'
    click_on 'Search the archive'
    click_on 'Rossi, Mario'

    row = find('.Segment', text: /My name is Mario Rossi/)
    button = row.find("button[title='Bookmark segment']", visible: false)
    button.hover
    button.click

    fill_in 'title', with: ''
    fill_in 'title', with: 'interesting part'
    fill_in 'Note', with: 'Ut enim ad minim veniam, quis nostrud exercitation'
    click_on 'Bookmark'

    logout

    login_as 'alice@example.com'
    click_on 'Workbook'
    click_on 'Segments'
    assert_text 'interesting part'
    click_on 'Show segment'
    assert_text 'My name is Mario Rossi'
  end

  test 'changing metadata' do
    Interview.reindex
    DataHelper.test_media

    visit '/'
    login_as 'alice@example.com'
    click_on 'Editing interface'
    click_on 'Archive configuration'

    click_on 'Search the archive'
    click_on 'Rossi, Mario'

    within '.Sidebar' do
      click_on 'About the Person'
      sleep 1
      click_on 'Edit'
    end

    fill_in 'First Name (en)', with: ''
    fill_in 'First Name (en)', with: 'Marco'
    click_on 'Submit'
    within '.MediaHeader' do
      assert_text 'Marco Rossi'
    end

    click_on 'Index'
    click_on 'Add new subentry'
    fill_in 'Name (en) *', with: 'city'
    within '#registry_name' do
      click_on 'Submit'
    end
    within '#registry_entry' do
      click_on 'Submit'
    end

    click_on 'Curation/indexing'
    sleep 1
    click_on 'Edit Index Reference Types'
    all("button[title='Add']")[0].click
    sleep 1
    select 'city'
    fill_in 'Name (en)', with: 'City'
    fill_in 'Code *', with: 'city'
    click_on 'Submit'

    click_on 'Search the archive'
    click_on 'Rossi, Mario'
    sleep 1
    click_on 'Link index entry'

    # click_on 'Registereintrag verknüpfen'
    # -> booom!
    # binding.pry
  end

  test 'modify segment' do
    Interview.reindex
    DataHelper.test_media

    visit '/'
    login_as 'alice@example.com'
    click_on 'Search the archive'
    click_on 'Rossi, Mario'

    click_on 'Editing interface'

    click_on 'Add heading'
    fill_in 'Main heading (en)', with: 'introduction'
    click_on 'Submit'
    reload_page
    click_on 'Table of contents'
    assert_text 'introduction'

    click_on 'Transcript'
    click_on 'Edit transcript'
    select 'Dupont, Jean'
    click_on 'Submit'
    assert_text "JD\nMy name is Mario Rossi"

    click_on 'Add annotations'
    click_on 'Anmerkung hinzufügen'
    find('.public-DraftEditor-content').send_keys('my annotation')
    click_on 'Submit'
  end
end
