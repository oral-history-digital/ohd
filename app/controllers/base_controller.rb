class BaseController < ResourceController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password

  before_filter :set_locale

  before_filter :current_query_params

  before_filter :current_search

  before_filter :init_search

  private

  def set_locale
    @locale = params[:locale] || session[:locale] || 'de'
    session[:locale] = @locale
    I18n.locale = @locale
    I18n.load_path += Dir[ File.join(RAILS_ROOT, 'lib', 'locale', '*.{rb,yml}') ]
  end

  def current_search
    query = @query_params || params
    @search = Search.from_params(query)
  end

  def init_search
    @search.search!
    @search.segment_search! if model_name == 'interview'
  end

  # This retrieves the query params of the current search from the session.
  # It's important to deactivate this in all contexts that perform a new search.
  def current_query_params
    @query_params = session[:query] || {}
  end
  
end