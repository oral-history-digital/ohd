class SessionsController < Devise::SessionsController

  skip_before_action :authenticate_user_account!, only: [:create]
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped
  skip_before_action :require_no_authentication, only: [:new]

  respond_to :json, :html

  def new
    token = current_user_account && current_user_account.access_tokens.last

    if params[:href]
      redirect_to("#{params[:href]}?access_token=#{token && token.token}&checked_ohd_session=true")
    else
      super
    end
  end

  def create
    self.resource = warden.authenticate!(auth_options)
    access_token = Doorkeeper::AccessToken.create!(resource_owner_id: resource.id) if resource
    #access_token = Doorkeeper::AccessToken.create!(application_id: application_id, resource_owner_id: resource.id)
    #render json: Doorkeeper::OAuth::TokenResponse.new(access_token).body

    sign_in(resource_name, resource)
    yield resource if block_given?
    respond_with resource, location: "/#{params[:locale]}"
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
    super
  end

end
