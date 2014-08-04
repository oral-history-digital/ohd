class TestPages::ApplicationPage < TestPages::Page
  def flash_message
    find('#flashNotice').text
  end

  def is_current_page?
    self.path == URI.parse(current_url).path
  end

  def fill_autocomplete(field, options = {})
    fill_in field, :with => options[:with]

    page.execute_script "jQuery('##{field}').focus()"
    page.execute_script "jQuery('##{field}').keydown()"
  end

  def search_sidebar_element
    '#baseContainerRight'
  end

  def interviewee_name_facet_element
    '#interview_id h2' # in the search sidebar
  end

  def a_name_filter_element
    '#selected_interview_id' # in the search sidebar
  end
end
