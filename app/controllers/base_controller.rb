class BaseController < ResourceController::Base

  before_filter :check_user_authentication!
  before_filter :determine_user

  private

  def render_localized(options = nil, extra_options = {}, &block)
    if !options[:template].blank?
      options[:template] = localize_template_path(options[:template])
    elsif !options[:action].blank?
      options[:action] = localize_template_path(options[:action].to_s)
    end
    if block_given?
      render(options, extra_options) do
        eval block
      end
    else
      render(options, extra_options)
    end
  end

  def localize_template_path(path)
    path_tokens = path.split('/')
    template_name = path_tokens.pop
    path = path_tokens.join('/')
    path << '/' unless path.blank?
    template_name << '.html.erb' unless template_name.include?('.')
    template_name_parts = template_name.split('.')
    path << template_name_parts.shift << ".#{I18n.locale}." << template_name_parts.join('.')
  end

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
    @current_user = current_user
    raise ActiveRecord::RecordNotFound if @current_user.nil?
  end

  def determine_user
    @current_user = current_user
  end

  # authentication and extended IP-tracking wrapped together
  def check_user_authentication!
    authenticate_user!
    unless current_user.nil?
      current_ip = current_user.proxy_owner.current_sign_in_ip || request.remote_ip
      if session[:current_ip] != current_ip
        tracked_ip = UserAccountIP.find_or_initialize_by_ip_and_user_account_id(current_ip, current_user.proxy_owner.id)
        begin
          tracked_ip.save if tracked_ip.new_record?
        rescue
          # prevent unexpected errors from causing status 500
          tracked_ip = UserAccountIP.new({:ip => current_ip})
        end
        session[:current_ip] = tracked_ip.ip
      end
    end
  end

end
