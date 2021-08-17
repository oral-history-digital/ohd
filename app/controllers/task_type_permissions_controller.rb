class TaskTypePermissionsController < ApplicationController

  def create
    authorize TaskTypePermission
    @task_type_permission = TaskTypePermission.create task_type_permission_params
    @task_type_permission.task_type.touch 

    respond @task_type_permission.task_type
  end

  def destroy 
    @task_type_permission = TaskTypePermission.find(params[:id])
    authorize @task_type_permission
    task_type = @task_type_permission.task_type
    @task_type_permission.destroy

    respond task_type
  end

  private

  def respond task_type
    respond_to do |format|
      format.json do
        render json: {
          nested_id: task_type.id,
          data: cache_single(task_type),
          nested_data_type: "task_types",
          data_type: 'projects',
          id: current_project.id,
        }
      end
    end
  end

  def task_type_permission_params
    params.require(:task_type_permission).
      permit(
        :task_type_id,
        :permission_id
    )
  end
end
