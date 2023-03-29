class ConfirmationsController < Devise::ConfirmationsController
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  protected

  def after_confirmation_path_for(resource_name, resource)
    resource.pre_register_location
  end 

end
