module SearchFilters

  # This retrieves the query params of the current search from the session.
  # It's important to deactivate or override this in all contexts that perform a new search.
  # (i.e. searches_controller).
  def current_query_params
    @query_params ||= params.dup.delete_if{|k,v| !Search::QUERY_PARAMS.include?(k.to_s)}
    @query_params ||= signed_in?(:user_account) ? (session[:query] || nil) : nil
  end

  def current_search
    query = current_query_params || params || {}
    @search = Search.from_params(query)
  end

  def current_search_for_side_panel
    current_search
    @search.search!
    @search.segment_search! if defined?(model_name) && model_name == 'interview'
  end
  
end