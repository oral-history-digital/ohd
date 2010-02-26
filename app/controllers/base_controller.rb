class BaseController < ResourceController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password

  before_filter :set_locale

  before_filter :current_query_params

  before_filter :current_search

  before_filter :init_search

  before_filter :set_search_update_mode

  private

  def set_locale
    locale = params[:locale] || 'de'
    I18n.locale = locale
    I18n.load_path += Dir[ File.join(RAILS_ROOT, 'lib', 'locale', '*.{rb,yml}') ]
  end

  def current_search
    puts "\n\n@@@@ CURRENT_SEARCH\n@query_params = #{@query_params.inspect}"
    query = @query_params || params
    query[:page] = params[:page] unless query.nil? || !query[:page].nil? || params[:page].nil?
    @search = Search.from_params(query)
  end

  def init_search
    @search.search!
    @search.segment_search! if model_name == 'interview'
  end

  # Determine the search update mode: will only the search form be changed,
  # or will the search results be rendered in the content?
  def set_search_update_mode
    if action_name == 'index'
      @search_update_contents = true
    else
      @search_update_contents = false
    end
  end

  # This retrieves the query params of the current search from the session.
  # It's important to deactivate this in all contexts that perform a new search.
  def current_query_params
    @query_params = session[:query] || {}
  end
  
end