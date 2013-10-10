class Admin::BaseController < BaseController
  include ExceptionNotifiable
  
  before_filter :authenticate_admin_account
  skip_before_filter  :check_user_authentication!

  layout 'admin'

  private

  def set_locale
    @locale = 'de'
    super
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
