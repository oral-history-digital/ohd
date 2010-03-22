class BaseController < ResourceController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password

  before_filter :set_locale

  before_filter :current_query_params

  before_filter :current_search

  before_filter :init_search

  private

  def set_locale
    @locale = params[:locale] || session[:locale] || 'de'
    session[:locale] = @locale
    I18n.locale = @locale
    I18n.load_path += Dir[ File.join(RAILS_ROOT, 'lib', 'locale', '*.{rb,yml}') ]
  end

  def current_search
    query = @query_params || params
    @search = Search.from_params(query)
  end

  def init_search
    @search.search!
    @search.segment_search! if model_name == 'interview'
  end

  # This retrieves the query params of the current search from the session.
  # It's important to deactivate this in all contexts that perform a new search.
  def current_query_params
    @query_params = session[:query] || {}
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
      render(options, extra_options)
    end
  end

  def localize_template_path(path)
    return path if @locale.blank?
    path_tokens = path.split('/')
    template_name = path_tokens.pop
    path = path_tokens.join('/')
    path << '/' unless path.blank?
    template_name << '.html.erb' unless template_name.include?('.')
    template_name_parts = template_name.split('.')
    path << template_name_parts.shift << ".#{@locale}." << template_name_parts.join('.')
  end
  
end