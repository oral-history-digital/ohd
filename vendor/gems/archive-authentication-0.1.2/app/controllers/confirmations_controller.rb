class ConfirmationsController < ApplicationController
  include Devise::Controllers::InternalHelpers

  # GET /resource/confirmation/new
  def new
    build_resource
    render_with_scope :new
  end

  # POST /resource/confirmation
  def create
    self.resource = resource_class.send_confirmation_instructions(params[resource_name])

    if resource.errors.empty?
      set_flash_message :notice, :send_instructions
      redirect_to new_session_path(resource_name)
    else
      render_with_scope :new
    end
  end

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
      render_with_scope :new
    end
  end
end
