class InterviewPermissionsController < ApplicationController
  before_action :set_interview_permission, only: [:destroy]

  def create
    authorize InterviewPermission

    wanted_interview_ids = interview_permission_params[:interview_ids] || []
    unwanted_interview_ids = current_project.interviews.restricted.pluck(:id) - wanted_interview_ids.map(&:to_i)

    binding.pry
    user = User.find(interview_permission_params[:user_id])
    user.interview_permissions.where(interview_id: unwanted_interview_ids).destroy_all

    wanted_interview_ids.compact.uniq.each do |interview_id|
      next if user.interview_permissions.exists?(interview_id: interview_id)
      next unless current_project.interviews.restricted.exists?(interview_id)
      InterviewPermission.create(user: user, interview_id: interview_id)
    end

    binding.pry
    respond_to do |format|
      format.json do
        render json: data_json(user, msg: 'processed')
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
        :user_id,
        :interview_id,
        interview_ids: [],
      )
    end
end
