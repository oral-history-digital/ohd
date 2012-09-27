# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  include ExceptionNotifiable
  
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  prepend_before_filter :set_locale

  include SearchFilters

  # Scrub sensitive parameters from your log
  filter_parameter_logging :password

  before_filter :current_search_for_side_panel

  def set_locale  
    @locale = params[:locale] || session[:locale] || 'de'
    session[:locale] = @locale
    I18n.locale = @locale
    I18n.load_path += Dir[ File.join(RAILS_ROOT, 'lib', 'locale', '*.{rb,yml}') ]
  end

  # resetting the remember_me_token on CSRF failure
  def handle_unverified_request
    begin
      super
    rescue Exception => e
      logger.warn e.message
    end
    cookies.delete 'remember_user_token'
    sign_out :user
  end

end
