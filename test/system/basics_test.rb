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
    # click_on 'Logout'
    # binding.pry

    # # enjoy ...
    # visit '/'
    # login_as 'mrossi@example.com'
    # asert_text 'Logged in as Mario Rossi'
  end
end
