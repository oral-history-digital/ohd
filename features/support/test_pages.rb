module TestPages
  def get_page_by_name(page_name)
    page_parts = page_name.split(/\s+/) << 'page'
    "::TestPages::#{page_parts.join('_').camelize}".constantize.instance
  end
  module_function :get_page_by_name

  require 'singleton'
  class Page
    include ::Singleton
    include ::Capybara::DSL
    include ::FactoryGirl::Syntax::Methods
  end
end

World(TestPages)
