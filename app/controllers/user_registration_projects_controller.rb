class UserRegistrationProjectsController < ApplicationController

  def create
    authorize UserRegistrationProject
    @user_registration_project = UserRegistrationProject.new user_registration_project_params
    @user_registration_project.user_registration_id = current_user_account.user_registration.id
    @user_registration_project.save
    @user_registration_project.grant_project_access_instantly! if current_project.grant_project_access_instantly?
    current_user_account.touch
    current_user_account.user_registration.touch

    respond_to do |format|
      format.json do
        render json: {
          id: 'current',
          data_type: 'accounts',
          data: current_user_account && ::UserAccountSerializer.new(current_user_account)
        }
      end
    end
  end

  def update
    @user_registration_project = UserRegistrationProject.find params[:id]
    authorize @user_registration_project
    # workflow gem uses update_column which does not update updated_at!
    @user_registration_project.updated_at = DateTime.now
    @user_registration_project.update user_registration_project_params
    @user_registration_project.user_account.touch

    respond_to do |format|
      format.json do
        render json: data_json(@user_registration_project.user_registration, msg: 'processed')
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
