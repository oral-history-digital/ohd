class UserProjectsController < ApplicationController

  def create
    authorize UserProject
    @user_project = UserProject.create user_project_params

    respond_to do |format|
      format.json do
        render json: {
          id: 'current',
          data_type: 'users',
          data: current_user && ::UserSerializer.new(current_user)
        }
      end
    end
  end

  def update
    @user_project = UserProject.find params[:id]
    authorize @user_project
    @user_project.update user_project_params
    # workflow gem uses update_column which does not update updated_at!
    @user_project.touch

    respond_to do |format|
      format.json do
        render json: {
          id: @user_project.user == current_user ? 'current' : @user_project.user_id,
          data_type: 'users',
          data: ::UserSerializer.new(@user_project.user),
        }
      end
    end
  end

  private

  def user_project_params
    params.require(:user_project).
      permit(
        :project_id,
        :user_id,
        :workflow_state,
        :mail_text,
        :tos_agreement,
        :receive_newsletter,
        :appellation,
        :first_name,
        :last_name,
        :street,
        :zipcode,
        :city,
        :country,
        :job_description,
        :research_intentions,
        :specification,
        :organization,
        :pre_access_location,
    )
  end
end
