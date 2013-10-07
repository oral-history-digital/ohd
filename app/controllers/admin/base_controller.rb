class Admin::BaseController < BaseController
  include ExceptionNotification::Notifiable

  before_filter :authenticate_admin_account
  skip_before_filter  :check_user_authentication!

  layout 'admin'

  private

  def set_locale
    @valid_locales = ['de']
    @locale = 'de'
    session[:locale] = @locale
    I18n.locale = @locale
    I18n.load_path += Dir[ File.join(RAILS_ROOT, 'lib', 'locale', '*.{rb,yml}') ]
  end

  def authenticate_admin_account
    if !signed_in?(:user_account)
      session[:"user_account.return_to"] = request.request_uri
      flash[:alert] = t('unauthenticated_search', :scope => 'devise.sessions')
      redirect_to new_user_account_session_url
    elsif !current_user_account.admin?
      flash[:alert] = "Sie haben keine Administratorenrechte!"
      redirect_to new_user_account_session_url
    end
  end

end
