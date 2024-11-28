class Admin::BaseController < ApplicationController

  before_action :authenticate_admin_account
  #skip_before_action  :check_user_authentication!

  layout 'admin'

  # overwrite pundit`s actions  here to always use scoped policies for admin actions
  # https://github.com/varvet/pundit#policy-namespacing
  # 
  def policy_scope(scope)
    super([:admin, scope])
  end

  def authorize(record, query = nil)
    super([:admin, record], query)
  end

  private

  def authenticate_admin_account
    if !signed_in?(:user)
      session[:"user.return_to"] = request.request_uri
      flash[:alert] = t(:unauthenticated_search, :scope => 'devise.sessions')
      redirect_to new_user_session_url
    elsif !current_user.admin? || current_user.permissions.map(&:klass).include?('User')
      flash[:alert] = "Sie haben keine Administratorenrechte!"
      redirect_to new_user_session_url
    end
  end

end
