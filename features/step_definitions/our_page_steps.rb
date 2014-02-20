Given /^I am on the (.+?) page$/ do |page_name|
  goto_page(page_name)
end

When /^I do (.+?)(?: on the (.+?) page)?$/ do |action, page_name|
  page_instance = page_name ? set_page_by_name(page_name) : current_page
  page_instance.send(TestPages::Helper.to_method_name(action))
end

When /^(?:|I )go to the (.+?) page$/ do |page_name|
  goto_page(page_name)
end

When /^(?:|I )follow the "([^"]+?)" link$/ do |link|
  link = current_page.send("#{TestPages::Helper.to_method_name(link)}_link")
  selector = nil
  link, selector = link if link.is_a? Array
  with_scope(selector) do
    click_link(link)
  end
end

When /^(?:|I )press the "([^"]+?)" button$/ do |button|
  button = current_page.send("#{TestPages::Helper.to_method_name(button)}_button")
  selector = nil
  button, selector = button if button.is_a? Array
  with_scope(selector) do
    click_button(button)
  end
end

When /^(?:|I )click on the (.+?)(?: in the (.+?))$/ do |what, scope|
  clickable_element = current_page.send("#{TestPages::Helper.to_method_name(what)}_element")
  selector = scope ? current_page.send("#{TestPages::Helper.to_method_name(scope)}_element") : nil
  with_scope(selector) do
    find(clickable_element).click
  end
end

Then /^I should be on the (.+?) page$/ do |page_name|
  current_path = URI.parse(current_url).path
  page_instance = set_page_by_name(page_name)
  current_path.should == page_instance.path
end

Then /^I should see (.+?)(?: on the (.+?) page)?(?: in the (.+?))?$/ do |what, page_name, where|
  page_instance = page_name ? set_page_by_name(page_name) : current_page
  options = {}
  what = page_instance.send("#{TestPages::Helper.to_method_name(what)}_element")
  what, options = what if what.is_a? Array
  scope = where ? page_instance.send("#{TestPages::Helper.to_method_name(where)}_element") : nil
  with_scope(scope) do
    page.should have_css(what, options)
  end
end
