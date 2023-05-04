class PasswordsController < Devise::PasswordsController

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
      render json: resource
    else
      set_minimum_password_length
      render json: {active: true, error: 'devise.sessions.invalid_token'}
    end
  end

end
