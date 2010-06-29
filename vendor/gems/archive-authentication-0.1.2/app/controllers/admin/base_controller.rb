class Admin::BaseController < BaseController

  before_filter :authenticate_admin_account

  layout 'admin'

  private

  def set_locale
    @locale = 'de'
    session[:locale] = @locale
    I18n.locale = @locale
    I18n.load_path += Dir[ File.join(RAILS_ROOT, 'lib', 'locale', '*.{rb,yml}') ]
  end

  def authenticate_admin_account
    if !signed_in?(:user_account)
      flash[:alert] = t('unauthenticated_search', :scope => 'devise.sessions')
      redirect_to new_user_account_session_url
    else
      user = User.find_by_user_account_id(current_user_account.id)
      unless user.admin
        flash[:alert] = "Sie haben keine Administratorenrechte!"
        redirect_to new_user_account_session_url
      end      
    end
  end

end