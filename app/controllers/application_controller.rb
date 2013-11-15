# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  include ExceptionNotification::Notifiable

  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  prepend_before_filter :set_locale

  include SearchFilters

  # Scrub sensitive parameters from your log
  filter_parameter_logging :password

  before_filter :current_search_for_side_panel

  def set_locale(locale = nil, valid_locales = [])
    locale ||= (params[:locale] || I18n.default_locale).to_sym
    valid_locales = I18n.available_locales if valid_locales.empty?
    locale = I18n.default_locale unless valid_locales.include?(locale)
    I18n.locale = locale
  end

  def default_url_options(options={})
    { :locale => I18n.locale }
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
