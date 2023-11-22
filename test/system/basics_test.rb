require "application_system_test_case"

class BasicsTest < ApplicationSystemTestCase
  test 'transactional fixtures 1/2' do
    assert_equal 1, Project.count
    Project.create!(shortname: 'xyz')
    assert_equal 2, Project.count
  end

  test 'transactional fixtures 2/2' do
    assert_equal 1, Project.count
    Project.create!(shortname: 'xyz')
    assert_equal 2, Project.count
  end

  test "visiting the project 'home' page" do
    #binding.pry
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

    Capybara.reset_sessions!
    login_as 'john@example.com'
    assert_text 'The test archive'
    assert_no_text 'Please apply for activation'
  end

  test 'create interview' do
    visit '/'
    login_as 'alice@example.com'

    click_on 'Editing interface'
    click_on 'Curation'
    click_on 'Neues Interview anlegen'
    select 'Dupont, Jean'
    select 'Interviewee'
    fill_in 'Interview ID', with: 'test123'
    select 'Audio'
    select 'English', from: 'primary_language_id'
    select 'English', from: 'secondary_language_id'
    select 'English', from: 'primary_translation_language_id'
    fill_in 'Number of tapes', with: 1
    within '#interview' do
      click_on 'Neues Interview anlegen'
    end
    assert_text 'Das Interview wurde angelegt'
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
end
