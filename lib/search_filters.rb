module SearchFilters

  # This retrieves the query params of the current search from the session.
  # It's important to deactivate this in all contexts that perform a new search.
  def current_query_params
    @query_params = session[:query] || nil
  end

  def current_search
    query = current_query_params || params || {}
    @search = Search.from_params(query)
  end

  def init_search
    @search.search!
    @search.segment_search! if defined?(model_name) && model_name == 'interview'
  end
  
end