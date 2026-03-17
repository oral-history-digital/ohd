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
      render json: {
        success: true,
        user: resource,
      }
    else
      set_minimum_password_length
      render json: {active: true, error: 'devise.sessions.invalid_token'}
    end
  end

end
