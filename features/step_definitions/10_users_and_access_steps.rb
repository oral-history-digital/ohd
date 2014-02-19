Given /^I have a ZWAR user account$/ do
  # do nothing - the user account will be automatically created by the login page
end

Given /^I am logged in$/ do
  # Instantiate the start page early on as this will
  # load the data necessary for it.
  start_page = TestPages::StartPage.instance
  login_page = goto_page('login')
  login_page.login_as_a_test_user
  start_page.is_current_page?.should be_true
  start_page.flash_message.should eql start_page.successful_login_message
end
