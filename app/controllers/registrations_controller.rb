class RegistrationsController < Devise::RegistrationsController
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped
     
  def create
    super
    Rails.logger.warn("Devise user errors: #{resource.errors.full_messages}") if resource.errors.any?
  end
end

