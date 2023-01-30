class SessionsController < Devise::SessionsController

  #skip_before_action :authenticate_user_account!, only: [:create]
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped
  #skip_before_action :require_no_authentication, only: [:new, :create]

  respond_to :json, :html

  def is_logged_in
    redirect_to("#{get_url}?access_token=#{get_last_token}&checked_ohd_session=true")
  end

  def new
    @href = params[:href]
    redirect_to("#{get_url}?access_token=#{get_last_token}&checked_ohd_session=true") if current_user_account
    super
  end

  def create
    self.resource = warden.authenticate!(auth_options)
    access_token = Doorkeeper::AccessToken.create!(resource_owner_id: resource.id) if resource
    #access_token = Doorkeeper::AccessToken.create!(application_id: application_id, resource_owner_id: resource.id)
    #render json: Doorkeeper::OAuth::TokenResponse.new(access_token).body

    sign_in(resource_name, resource)
    yield resource if block_given?
    #location = params[:href] ?
      #"#{get_url}?access_token=#{get_last_token}&checked_ohd_session=true" :
      #"/#{params[:locale]}/projects"
    #respond_with resource, location: location
    if params[:href]
      redirect_to "#{get_url}?access_token=#{get_last_token}&checked_ohd_session=true"
    else
      respond_with resource, location: "/#{params[:locale]}/projects"
    end
  rescue BCrypt::Errors::InvalidHash
    respond_to do |format|
      format.json {
        render json: {error: 'change_to_bcrypt', email: params['user_account']['login']}
      }
    end
  end

  def destroy
    current_user_account.access_tokens.destroy_all
    current_user_account.sessions.destroy_all
    sign_out
    respond_to_on_destroy
  end

  private

  def get_url
    uri = URI.parse(params[:href])
    "#{uri.scheme}://#{uri.host}#{[80, 443].include?(uri.port) ? '' : ':' + uri.port.to_s}#{uri.path}"
  end

  def get_last_token
    current_user_account && current_user_account.access_tokens.last.token
  end
end
