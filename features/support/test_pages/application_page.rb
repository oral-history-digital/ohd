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

    selector = "ul.ui-autocomplete li.ui-menu-item" #a:contains('#{options[:select]}')"
    page.should have_selector(selector)

    page.execute_script %Q{ jQuery("#{selector}").mouseenter().click() }
  end
end
