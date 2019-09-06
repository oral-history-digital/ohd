class SessionsController < Devise::SessionsController  

  skip_before_action :authenticate_user_account!, only: [:create]
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  #clear_respond_to 
  respond_to :json, :html

  def create
    self.resource = warden.authenticate!(auth_options)
    binding.pry
    if resource.user_registration.projects.include?(current_project)
      set_flash_message!(:notice, :signed_in)
      sign_in(resource_name, resource)
      yield resource if block_given?
      respond_with resource, location: after_sign_in_path_for(resource)
    else
      render json: {error: 'not_your_project'}
    end
  rescue BCrypt::Errors::InvalidHash
    respond_to do |format|
      format.json {
        render json: {error: 'change_to_bcrypt', email: params['user_account']['login']}
      }
    end
  end

end
