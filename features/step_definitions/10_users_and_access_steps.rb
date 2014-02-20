Given /^I have a ZWAR user account$/ do
  # The user account will be created when instantiating the login page
  get_page_by_name('login')
end

Given /^I am logged in$/ do
  # Instantiate the start page early on as this will
  # load the data necessary for it.
  start_page = get_page_by_name('start')
  login_page = goto_page('login')
  login_page.login_as_a_test_user
  start_page.is_current_page?.should be_true
  start_page.flash_message.should eql start_page.successful_login_message
end
