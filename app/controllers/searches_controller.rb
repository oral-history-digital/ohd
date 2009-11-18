class SearchesController < BaseController

  actions :new

  new_action do
    before do
      @search.search!
      @current_search = @search
      @interviews = @search.results
    end
    wants.js do
      html = render_to_string({ :template => '/interviews/index.html', :layout => false })
      render :update do |page|
        page.replace_html 'innerContent', html
      end
    end
    wants.html do
      render :template => '/interviews/index.html'
    end
  end
  
end