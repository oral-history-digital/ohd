Then(/^I should receive an? (.*) email$/) do |email_name|
  email = get_email_by_name(email_name)
  unread_emails_for(email.recipient).size.should == 1
  open_email(email.recipient)
  current_email.should have_subject(email.subject)
  current_email.body.should =~ email.body
end
