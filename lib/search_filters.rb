module SearchFilters

  def current_search
    query = @query_params || params
    @search = Search.from_params(query)
  end

  def init_search
    @search.search!
    @search.segment_search! if defined?(model_name) && model_name == 'interview'
  end
  
end