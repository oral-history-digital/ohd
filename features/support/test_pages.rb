module TestPages
  include ::Capybara::DSL

  module Helper
    def to_method_name(words)
      words.split(/\s+/).join('_')
    end
    module_function :to_method_name
  end

  def get_page_by_name(page_name)
    page_parts = page_name.split(/\s+/) << 'page'
    @pages ||= {}
    @pages[page_name] ||= "::TestPages::#{page_parts.join('_').camelize}".constantize.new
    @pages[page_name]
  end

  def goto_page(page_name)
    page_instance = get_page_by_name(page_name)
    visit page_instance.path
    @current_page = page_instance
  end

  def set_page_by_name(page_name)
    page_instance = get_page_by_name(page_name)
    @current_page = page_instance
  end

  def current_page
    @current_page
  end

  def clear_pages
    @pages = []
  end

  class Page
    include ::Capybara::DSL
    include ::FactoryGirl::Syntax::Methods
    include ::Spec::Matchers
  end
end

World(TestPages)

After do
  clear_pages
end
