class InterviewPermissionsController < ApplicationController
  before_action :set_interview_permission, only: [:destroy]

  def create
    authorize InterviewPermission
    @interview_permission = InterviewPermission.create interview_permission_params

    respond_to do |format|
      format.json do
        render json: data_json(@interview_permission.user, msg: 'processed')
      end
    end
  end

  def destroy
    user = @interview_permission.user
    @interview_permission.destroy
    user.touch

    respond_to do |format|
      format.json do
        render json: data_json(user, msg: 'processed')
      end
    end
  end

  private

    def set_interview_permission
      @interview_permission = InterviewPermission.find(params[:id])
      authorize @interview_permission
    end

    def interview_permission_params
      params.require(:interview_permission).permit(
        :interview_id,
        :user_id,
      )
    end
end
