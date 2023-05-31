class SessionsController < Devise::SessionsController

  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  before_action :set_project, only: [:new, :create, :is_logged_in]
  before_action :set_path, only: [:new, :create, :is_logged_in]
  before_action :set_locale, only: [:new, :create, :is_logged_in]

  respond_to :json, :html

  layout 'login'

  def is_logged_in
    redirect_to url_with_access_token
  end

  def new
    redirect_to url_with_access_token if current_user
    super
  end

  def create
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    yield resource if block_given?
    respond_with resource, location: url_with_access_token
  rescue BCrypt::Errors::InvalidHash
    respond_to do |format|
      format.json {
        render json: {error: 'change_to_bcrypt', email: params['user']['login']}
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
    u = "#{url}?checked_ohd_session=true"
    last_token ? "#{u}&access_token=#{last_token}" : u
  end

  def url
    "#{@project.domain_with_optional_identifier}#{@path}"
  end

  def path
    @path.blank? ? "/#{params[:locale]}/projects" : @path
  end

  def set_project
    @project = Project.where(shortname: params[:project]).first
  end

  def set_path
    @path = params[:path]
  end

  def set_locale
    @locale = params[:locale]
  end

  def last_token
    current_user && current_user.access_tokens.last.token
  end

end
