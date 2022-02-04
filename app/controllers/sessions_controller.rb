class SessionsController < Devise::SessionsController

  skip_before_action :authenticate_user_account!, only: [:create]
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  #clear_respond_to
  respond_to :json, :html

  def create
    self.resource = warden.authenticate!(auth_options)
    #if resource.user_registration.projects.include?(current_project) && resource.user_registration.user_registration_projects.find_by_project_id(current_project).activated_at != nil
      set_flash_message!(:notice, :signed_in)
      sign_in(resource_name, resource)
      yield resource if block_given?
      respond_with resource, location: "/#{params[:locale]}"
    #else
      #sign_out
      #render json: {error: 'project_access_in_process'}
    #end
  rescue BCrypt::Errors::InvalidHash
    respond_to do |format|
      format.json {
        render json: {error: 'change_to_bcrypt', email: params['user_account']['login']}
      }
    end
  end

end
