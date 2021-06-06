class UserRegistrationProjectsController < ApplicationController

  def create
    authorize UserRegistrationProject
    @user_registration_project = UserRegistrationProject.new user_registration_project_params
    @user_registration_project.user_registration_id = current_user.user_registration.id
    @user_registration_project.save

    respond_to do |format|
      format.json do
        render json: data_json(@user_registration_project, msg: 'processed')
      end
    end
  end

  def update
    @user_registration_project = UserRegistrationProject.find params[:id]
    authorize @user_registration_project
    @user_registration_project.update_attributes user_registration_project_params
    respond_to do |format|
      format.json do
        render json: data_json(@user_registration_project, msg: 'processed')
      end
    end
  end

  private

  def user_registration_project_params
    params.require(:user_registration_project).
      permit(
        :project_id,
        :workflow_state,
        :admin_comments
    )
  end
end
