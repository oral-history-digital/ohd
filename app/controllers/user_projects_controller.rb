class UserProjectsController < ApplicationController

  def create
    authorize UserProject
    @user_project = UserProject.new user_project_params
    @user_project.user_id = current_user.id
    @user_project.save
    @user_project.grant_project_access_instantly! if current_project.grant_project_access_instantly?
    current_user.touch

    respond_to do |format|
      format.json do
        render json: {
          id: 'current',
          data_type: 'accounts',
          data: current_user && ::UserSerializer.new(current_user)
        }
      end
    end
  end

  def update
    @user_project = UserProject.find params[:id]
    authorize @user_project
    # workflow gem uses update_column which does not update updated_at!
    @user_project.updated_at = DateTime.now
    @user_project.update user_project_params
    @user_project.user.touch

    respond_to do |format|
      format.json do
        render json: data_json(@user_project.user, msg: 'processed')
      end
    end
  end

  private

  def user_project_params
    params.require(:user_project).
      permit(
        :project_id,
        :workflow_state,
        :admin_comments
    )
  end
end
