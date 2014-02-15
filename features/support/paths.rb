module NavigationHelpers
  # Maps a name to a path. Used by the
  #
  #   When /^I go to (.+)$/ do |page_name|
  #
  # step definition in web_steps.rb
  #
  def path_to(page_name)
    page_name =~ /the (.*) page/
    page_instance = get_page_by_name($1)
    page_instance.path
  end
end

World(NavigationHelpers)
