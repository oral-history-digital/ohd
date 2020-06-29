class TasksController < ApplicationController

  def create
    authorize Task
    @task = Task.create task_params
    @task.update_attributes(supervisor_id: current_user_account.id)
    @task.user_account.user_registration.touch

    respond_to do |format|
      format.json do
        render json: data_json(@task.user_account.user_registration,
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
    @task.update_attributes task_params
    @task.user_account.user_registration.touch

    respond_to do |format|
      format.json do
        render json: current_user_account && {
          id: 'current',
          data_type: 'accounts',
          data: ::UserAccountSerializer.new(current_user_account),
          msg: 'processed'
        } || {}
      end
    end
  end

  def index
    tasks = policy_scope(Task)

    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-tasks-visible-for-#{current_user.id}-#{Task.maximum(:updated_at)}" do
          {
            data: tasks.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
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
    user_registration = @task.user_account.user_registration
    @task.destroy
    user_registration.touch

    respond_to do |format|
      format.json {
        render json: data_json(@task.user_account.user_registration,
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
        :name,
        :desc,
        :authorized_type,
        :authorized_id,
        :user_account_id,
        :supervisor_id,
        :workflow_state
    )
  end
end
