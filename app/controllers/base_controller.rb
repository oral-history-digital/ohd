class BaseController < ResourceController::Base
  include ExceptionNotification::Notifiable

  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  before_filter :check_user_authentication!

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password

  prepend_before_filter :set_locale

  include SearchFilters

  before_filter :current_search_for_side_panel,
                :determine_user

  private

  def set_locale
    @valid_locales = Dir.glob(File.join(RAILS_ROOT, 'config', 'locales', '*.yml')).map{|l| (l.split('/').last || '')[/^[a-z]+/]}.sort
    @locale = (params[:locale] || session[:locale] || 'de').to_s
    @locale = 'de' unless @valid_locales.include?(@locale)
    session[:locale] = @locale
    I18n.locale = @locale
    I18n.load_path += Dir[ File.join(RAILS_ROOT, 'lib', 'locale', '*.{rb,yml}') ]
  end

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
      #puts "@@@ LOCALE: #{@locale}\nOPTIONS: #{options.inspect}\n\nEXTRA: #{extra_options.inspect}\n@@@"
      render(options, extra_options)
    end
  end

  def localize_template_path(path)
    return path if @locale.blank?
    path_tokens = path.split('/')
    # puts "\n@@@ PATH TOKENS: #{path_tokens.join(' / ')}\n@@@\n"
    template_name = path_tokens.pop
    path = path_tokens.join('/')
    path << '/' unless path.blank?
    template_name << '.html.erb' unless template_name.include?('.')
    template_name_parts = template_name.split('.')
    path << template_name_parts.shift << ".#{@locale}." << template_name_parts.join('.')
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
