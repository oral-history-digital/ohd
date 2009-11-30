class SearchesController < BaseController

  actions :new

  new_action do
    before do
      @search.search!
      @interviews = @search.results
    end
    wants.js do
      results_html = render_to_string({ :template => '/interviews/index.html', :layout => false })
      service_html = render_to_string({ :partial => '/searches/search.html', :object => @search })
      search_facets_html = render_to_string({ :partial => '/searches/facets.html', :object => @search })
      render :update do |page|
        page.replace_html 'innerContent', results_html
        page.replace_html 'baseServices', service_html
        page.replace_html 'baseContainerRight', search_facets_html
      end
    end
    wants.html do
      render :template => '/interviews/index.html'
    end
  end
  
end