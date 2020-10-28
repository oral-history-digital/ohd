class PasswordsController < Devise::PasswordsController

  skip_before_action :require_no_authentication
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  respond_to :json, :html

  # PUT /resource/password
  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      if Devise.sign_in_after_reset_password
        flash_message = resource.active_for_authentication? ? :updated : :updated_not_active
        set_flash_message!(:notice, flash_message)
        sign_in(resource_name, resource)
      else
        set_flash_message!(:notice, :updated_not_active)
      end
      #respond_with resource, location: after_resetting_password_path_for(resource)
      render json: resource
    else
      set_minimum_password_length
      #respond_with resource
      render json: {active: true, error: 'devise.sessions.invalid_token'}
    end
  end

  #def resource_params
    #params.require(resource_name).permit(:password, :password_confirmation, :reset_password_token)
  #end

end
