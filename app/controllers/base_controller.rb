class BaseController < ResourceController::Base
  include ExceptionNotifiable
  
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  before_filter :authenticate_user!

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password

  prepend_before_filter :set_locale

  include SearchFilters

  before_filter :current_search_for_side_panel

  append_before_filter :report_session_query

  @@valid_locales = Dir.glob(File.join(RAILS_ROOT, 'config', 'locales', '*.yml')).map{|l| (l.split('/').last || '')[/^a-z+/]}

  private

  def set_locale
    @locale = params[:locale] || session[:locale] || 'de'
    @locale = 'de' unless @@valid_locales.include?(@locale)
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

  def report_session_query
    puts "\n#### SESSION QUERY #{controller_name}/#{action_name}:\n#{session[:query].inspect}\n~~~~"
  end


end