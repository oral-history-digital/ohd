class BaseController < ResourceController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password

  before_filter :set_locale

  before_filter :current_search

  private

  def set_locale
    locale = params[:locale] || 'de'
    I18n.locale = locale
    I18n.load_path += Dir[ File.join(RAILS_ROOT, 'lib', 'locale', '*.{rb,yml}') ]
  end

  def current_search
    query = params[:search]
    query[:page] = params[:page] unless query.nil? || params[:page].nil?
    @search = Search.from_params(query)
  end
  
end