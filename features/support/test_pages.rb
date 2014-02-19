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
    "::TestPages::#{page_parts.join('_').camelize}".constantize.instance
  end
  module_function :get_page_by_name

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

  require 'singleton'
  class Page
    include ::Singleton
    include ::Capybara::DSL
    include ::FactoryGirl::Syntax::Methods
    include ::Spec::Matchers
  end
end

World(TestPages)
