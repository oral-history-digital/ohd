class TasksController < ApplicationController

  def create
    authorize Task
    @task = Task.create task_params
    respond_to do |format|
      format.json do
        render json: data_json(@task, 'processed')
      end
    end
  end

  def update
    @task = Task.find params[:id]
    authorize @task
    @task.update_attributes task_params
    respond_to do |format|
      format.json do
        render json: data_json(@task, 'processed')
      end
    end
  end

  def index
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "#{Project.project_id}-tasks-visible-for-#{current_user.id}-#{Task.maximum(:updated_at)}" do
          {
            data: policy_scope(Task).inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            data_type: 'tasks'
          }
        end
        render json: json
      end
    end
  end

  def destroy 
    @task = Task.find(params[:id])
    authorize @task
    @task.destroy

    respond_to do |format|
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def task_params
    params.require(:task).
      permit(
        :desc,
        :authorized_type,
        :authorized_id,
        :user_id,
        :supervisor_id
    )
  end
end
