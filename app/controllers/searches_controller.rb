class SearchesController < BaseController

  actions :new, :index

  skip_before_filter :current_query_params
  skip_before_filter :init_search

  before_filter :remove_search_term_from_params

  new_action do
    before do
      @search.search!
      reinstate_category_state
      @search.open_category = params['open_category']
      @interviews = @search.results

      session[:query] = @search.query_params
    end
    wants.js do
      puts "\n\n@@@ SEARCH open category: #{@search.open_category}"
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
      render :nothing => true
    end
  end

  index do
    before do
      @search.search!
      reinstate_category_state
      @search.segment_search!
      @search.open_category = params['open_category']
      @interviews = @search.results

      session[:query] = @search.query_params

    end
    wants.js do
      puts "\n\n@@@ SEARCH open category: #{@search.open_category}"
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

  def interview
    @search = Search.in_interview(params[:id],params[:fulltext])
    @search.segment_search!
    archive_id = @search.results.first.nil? ? '' : @search.results.first.archive_id
    @segments = @search.matching_segments_for(archive_id)
    respond_to do |format|
      format.html do
        render :template => '/interviews/show'
      end
      format.js do
        segments_html = render_to_string({:partial => '/interviews/segments.html' })
        render :update do |page|
          page.replace_html 'search-results', segments_html
          page.show 'search-results'
          page.show 'search-results-toggle'
        end
      end
    end
  end

  def person_name
    query_params = params.merge({:partial_person_name => params.delete('person_name')})
    @search = Search.from_params(query_params)
    begin
      @search.search!
    rescue Sunspot
      @search.results = []
    end
    respond_to do |format|
      format.html do
        # ?
      end
      format.js do
        if @search.results.empty?
          render :text => '<span>keine Personen gefunden</span>'
        else
          render :partial => 'person_name', :collection => @search.results
        end
      end
    end
  end

  private

  # This method clears the default search field contents from the query
  # on the server-side, in case this is missed by the JS client code.
  def remove_search_term_from_params
    unless params.blank? || params[:fulltext].blank?
      params.delete(:fulltext) if params[:fulltext] == t('search_term')
    end
  end

  # This method parses the reinstate[] parameter (array) to set the
  # category settings on the current search (preferrably after conducting the search).
  def reinstate_category_state
    unless params[:reinstate].blank? || !params[:reinstate].is_a?(Array)

      params[:reinstate].each do |category_param|

        category = category_param.sub(/_\d+$/,'')
        id = category_param[/\d+$/].to_i

        if @search.respond_to?(category)

          @search.send("#{category}=", (@search.send(category) || []) << id)

        end

      end

    end
  end
  
end