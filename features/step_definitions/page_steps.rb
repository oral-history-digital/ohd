When(/^I (.*) while on the (.*) page$/) do |action, page_name|
  page_instance = get_page_by_name(page_name)
  action = action.split(/\s+/).join('_')
  page_instance.send(action)
end

Then(/^I should see (.*) on the (.*) page$/) do |what, page_name|
  page_instance = get_page_by_name(page_name)
  what = what.split(/\s+/).join('_')
  text = page_instance.send(what)
  page_instance.should have_content(text)
end
