class ConfirmationsController < ApplicationController
  #include Devise::Controllers::InternalHelpers

  # GET /resource/confirmation?confirmation_token=abcdef
  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])

    if resource.errors.empty?
      set_flash_message :notice, :confirmed
      sign_in(resource_name, resource)
      change_password_token = resource.send(:generate_reset_password_token)
      resource.save
      redirect_to edit_user_account_password_url(:reset_password_token => change_password_token)
    else
      puts resource.errors.full_messages
      flash[:alert] = resource.errors.full_messages
      redirect_to login_url
    end
  end
end
