class SessionsController < Devise::SessionsController

  skip_before_action :require_no_authentication
  skip_before_action :check_ohd_session
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  before_action :set_project, only: [:new, :create, :is_logged_in]
  before_action :set_path, only: [:new, :create, :is_logged_in]
  before_action :set_locale, only: [:new, :create, :is_logged_in]

  respond_to :json, :html

  layout 'login'

  def is_logged_in
    redirect_to last_token ?
      url_with_access_token :
      join_params(url_with_access_token, "checked_ohd_session=true")
  end

  def new
    if current_user
      redirect_to url_with_access_token
    else
      if request.base_url == OHD_DOMAIN
        super
      else
        self.resource = resource_class.new(sign_in_params)
        project = Project.by_domain(request.base_url)
        path = stored_location_for(resource).gsub("?checked_ohd_session=true", "")
        redirect_to "#{OHD_DOMAIN}#{new_user_session_path}?project=#{project.shortname}&path=#{path}"
      end
    end
  end

  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    yield resource if block_given?
    respond_with resource, location: url_with_access_token
  rescue BCrypt::Errors::InvalidHash
    respond_with(resource, location: url_with_access_token) do |format|
      format.json {
        render json: {error: 'change_to_bcrypt', email: params['user_account']['login']}
      }
    end    
  end

  def destroy
    current_user.access_tokens.destroy_all
    current_user.sessions.destroy_all
    sign_out
    respond_to_on_destroy
  end

  private

  def url_with_access_token
    last_token ? join_params(url, "access_token=#{last_token}") : url
  end

  def url
    "#{!@project.archive_domain.blank? ? @project.archive_domain : OHD_DOMAIN}#{@path}"
  end

  def set_project
    @project = Project.where(shortname: params[:project]).first || Project.ohd
  end

  def set_path
    @path = params[:path]
  end

  def set_locale
    @locale = params[:locale]
    I18n.locale = @locale if @locale
  end

  def last_token
    current_user&.access_tokens&.last&.token
  end

  def join_params(base_url, params_string)
    "#{base_url}#{base_url.include?('?') ? '&' : '?'}#{params_string}"
  end
end
