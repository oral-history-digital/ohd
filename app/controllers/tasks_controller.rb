class TasksController < ApplicationController

  def create
    authorize Task
    @task = Task.create task_params
    @task.update(supervisor_id: current_user.id)
    @task.user.touch

    respond_to do |format|
      format.json do
        render json: data_json(@task.user,
                               msg: 'processed',
                               reload_data_type: 'accounts',
                               reload_id: "current"
                              )
      end
    end
  end

  def update
    @task = Task.find params[:id]
    authorize @task
    @task.update task_params
    @task.user.touch if @task.user
    @task.supervisor.touch if @task.supervisor

    respond_to do |format|
      format.json do
        render json: {
          id: @task.id,
          data_type: 'tasks',
          data: ::TaskSerializer.new(@task),
          msg: 'processed',
          reload_data_type: 'accounts',
          reload_id: 'current' 
        } || {}
      end
    end
  end

  def index
    @interview = Interview.find_by_archive_id(params[:for_interview])
    policy_scope(Task)
    tasks = @interview.tasks

    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-interview-tasks-#{@interview.id}-#{@interview.tasks.count}-#{@interview.tasks.maximum(:updated_at)}" do
          {
            data: tasks.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            data_type: 'tasks',
            extra_params: "for_interview_#{params[:for_interview]}"
          }
        end
        render json: json
      end
    end
  end

  def destroy
    @task = Task.find(params[:id])
    authorize @task
    user = @task.user
    @task.destroy
    user.touch

    respond_to do |format|
      format.json {
        render json: data_json(@task.user,
                               msg: 'processed',
                               reload_data_type: 'accounts',
                               reload_id: "current"
                              )
      }
    end
  end

  private

  def task_params
    params.require(:task).
      permit(
        :task_type_id,
        :user_id,
        :supervisor_id,
        :interview_id,
        :archive_id,
        :workflow_state
    )
  end
end
