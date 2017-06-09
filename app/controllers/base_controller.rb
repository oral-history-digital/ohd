class BaseController < ApplicationController #ResourceController::Base

  before_action :authenticate_user_account!
  #before_filter :determine_user

  private

  def render_csv(filename)
    filename += '.csv'

    if request.env['HTTP_USER_AGENT'] =~ /msie/i
      headers['Pragma'] = 'public'
      headers["Content-type"] = "text/plain"
      headers['Cache-Control'] = 'no-cache, must-revalidate, post-check=0, pre-check=0'
      headers['Content-Disposition'] = "attachment; filename=\"#{filename}\""
      headers['Expires'] = "0"
    else
      headers["Content-Type"] ||= 'text/csv'
      headers["Content-Disposition"] = "attachment; filename=\"#{filename}\""
    end

    render :layout => false
  end

  def determine_user!
    @current_user_account = current_user_account
    raise ActiveRecord::RecordNotFound if @current_user_account.nil?
  end

  def determine_user
    @current_user_account = current_user_account
  end

  # authentication and extended IP-tracking wrapped together
  def check_user_authentication!
    authenticate_user!
    unless current_user_account.nil?
      current_ip = current_user_account.proxy_owner.current_sign_in_ip || request.remote_ip
      if session[:current_ip] != current_ip
        #tracked_ip = UserAccountIp.find_or_initialize_by_ip_and_user_account_id(current_ip, current_user_account.proxy_owner.id)
        tracked_ip = UserAccountIp.where(ip: current_ip , user_account_id: current_user_account.proxy_owner.id).first_or_initialize

        begin
          tracked_ip.save if tracked_ip.new_record?
        rescue
          # prevent unexpected errors from causing status 500
          tracked_ip = UserAccountIp.new({:ip => current_ip})
        end
        session[:current_ip] = tracked_ip.ip
      end
    end
  end

end
