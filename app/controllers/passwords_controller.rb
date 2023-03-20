class PasswordsController < Devise::PasswordsController

  skip_before_action :require_no_authentication
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  respond_to :json, :html

  # POST /resource/password
  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params, {project: current_project})
    yield resource if block_given?

    if successfully_sent?(resource)
      respond_with({}, location: after_sending_reset_password_instructions_path_for(resource_name))
    else
      respond_with(resource)
    end
  end

  # PUT /resource/password
  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      if Devise.sign_in_after_reset_password
        Doorkeeper::AccessToken.create!(resource_owner_id: resource.id) if resource
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

  def check_email
    email = params[:email]
    user = User.where(email: email).first

    if user
      if !user.confirmed?
        msg = 'account_confirmation_missing'
        # re-send the activation instructions
        user.resend_confirmation_instructions
        error = true
      else
        msg = nil
        error = false
      end
    else
      msg = 'still_not_registered'
      error = true
    end

    translated_msg = msg && I18n.backend.translate(
      params[:locale],
      "modules.registration.messages.#{msg}",
      email: email,
    )

    respond_to do |format|
      format.json do
        render json: {
          msg: translated_msg,
          error: error
        }
      end
    end
  end
  
end
