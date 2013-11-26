module SearchFilters

  # This only runs the 'current_search_for_side_panel'
  # filter when html format is requested.
  def current_search_for_side_panel_if_html
    return true unless request.format.html?
    current_search_for_side_panel
  end

  # This is a before-filter to be run in all controllers
  # that want to render the search sidebar.
  def current_search_for_side_panel
    query = current_query_params || params || {}
    @search = Search.from_params(query)
    @search.search!
    @search.segment_search! if defined?(model_name) && model_name == 'interview'
  end

  # Retrieve the query params of the current search from the session.
  # It's important to deactivate or override this in all contexts
  # that perform a new search (i.e. searches_controller).
  def current_query_params
    @auto_query_params ||= params.dup.delete_if{|k,v| !Search::QUERY_PARAMS.include?(k.to_s)}
    if @auto_query_params.nil? || @auto_query_params.empty?
      @auto_query_params = signed_in?(:user_account) ? (session[:query] || nil) : nil
    end
    @auto_query_params
  end

end
