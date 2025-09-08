class ConfirmationsController < Devise::ConfirmationsController
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def show
    super do |resource|
      if resource.errors.empty?
        resource.afirm! # workflow
        Doorkeeper::AccessToken.create!(resource_owner_id: resource.id)
        sign_in(resource)
      end
    end
  end

  protected

  def after_confirmation_path_for(resource_name, resource)
    resource.pre_register_location.split('?')[0]
  end 

end
