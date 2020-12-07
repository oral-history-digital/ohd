class TaskTypePermissionsController < ApplicationController

  def create
    authorize TaskTypePermission
    @task_type_permission = TaskTypePermission.create task_type_permission_params
    @task_type_permission.task_type.touch 

    respond_to do |format|
      format.json do
        render json: data_json(@task_type_permission.task_type, msg: 'processed')
      end
    end
  end

  def destroy 
    @task_type_permission = TaskTypePermission.find(params[:id])
    authorize @task_type_permission
    task_type = @task_type_permission.task_type
    @task_type_permission.destroy
    task_type.touch 

    respond_to do |format|
      format.json do
        render json: data_json(task_type, msg: 'processed')
      end
    end
  end

  private

  def task_type_permission_params
    params.require(:task_type_permission).
      permit(
        :task_type_id,
        :permission_id
    )
  end
end
