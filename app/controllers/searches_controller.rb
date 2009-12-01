class SearchesController < BaseController

  actions :new, :index

  before_filter :remove_search_term_from_params

  new_action do
    before do
      @search.search!
    end
    wants.js do
      service_html = render_to_string({ :partial => '/searches/search.html', :object => @search })
      search_facets_html = render_to_string({ :partial => '/searches/facets.html', :object => @search })
      render :update do |page|
        page.replace_html 'baseServices', service_html
        page.replace_html 'baseContainerRight', search_facets_html
      end
    end
    wants.html do
      render :nothing => true
    end
  end

  index do
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


  private

  # This method clears the default search field contents from the query
  # on the server-side, in case this is missed by the JS client code.
  def remove_search_term_from_params
    unless object_params.blank? || object_params[:fulltext].blank?
      object_params.delete(:fulltext) if object_params[:fulltext] == t('search_term')
    end
  end
  
end