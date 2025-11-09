class PasswordsController < Devise::PasswordsController

  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  respond_to :json, :html

  def new
    @component = 'OrderNewPassword'
    super
  end

  # PUT /resource/password
  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      if Devise.sign_in_after_reset_password
        flash_message = resource.active_for_authentication? ? :updated : :updated_not_active
        set_flash_message!(:notice, flash_message)
        resource.after_database_authentication
        sign_in(resource_name, resource)
      else
        set_flash_message!(:notice, :updated_not_active)
      end
      render json: {
        success: true,
        redirect_url: after_resetting_password_path_for(resource),
        user: resource,
      }
    else
      set_minimum_password_length
      render json: {active: true, error: 'devise.sessions.invalid_token'}
    end
  end

  protected
    def after_resetting_password_path_for(resource)
      last_token = resource.access_tokens.last.token
      url = resource.pre_register_location
      last_token ? "#{url}#{url.include?('?') ? '&' : '?'}access_token=#{last_token}" : url
    rescue
      "#{current_project.domain_with_optional_identifier}/#{params[:locale]}"
    end

end
