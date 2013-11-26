# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  include ExceptionNotification::Notifiable

  helper :all # include all helpers, all the time

  protect_from_forgery # See ActionController::RequestForgeryProtection for details
  filter_parameter_logging :password # Scrub sensitive parameters from your log

  include SearchFilters
  before_filter :current_search_for_side_panel

  prepend_before_filter :set_locale
  def set_locale(locale = nil, valid_locales = [])
    locale ||= (params[:locale] || I18n.default_locale).to_sym
    valid_locales = I18n.available_locales if valid_locales.empty?
    locale = I18n.default_locale unless valid_locales.include?(locale)
    I18n.locale = locale
  end

  # Append the locale to all requests.
  def default_url_options(options={})
    options.merge({ :locale => I18n.locale })
  end

  # Resetting the remember_me_token on CSRF failure.
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
