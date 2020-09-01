class TaskTypesController < ApplicationController

  def create
    authorize TaskType
    @task_type = TaskType.create task_type_params

    respond_to do |format|
      format.json do
        render json: {
          id: @task_type.project_id,
          data_type: 'projects',
          nested_data_type: 'task_types',
          nested_id: @task_type.id,
          data: cache_single(@task_type),
        }
      end
    end
  end

  def update
    @task_type = TaskType.find params[:id]
    authorize @task_type
    @task_type.update_attributes task_type_params

    respond_to do |format|
      format.json do
        render json: {
          id: @task_type.project_id,
          data_type: 'projects',
          nested_data_type: 'task_types',
          nested_id: @task_type.id,
          data: cache_single(@task_type),
        }
      end
    end
  end

  def index
    task_types = policy_scope(TaskType).where(project_id: current_project.id)

    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-task_types-#{TaskType.maximum(:updated_at)}" do
          {
            data: task_types.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            data_type: 'task_types'
          }
        end
        render json: json
      end
    end
  end

  def destroy
    @task_type = TaskType.find(params[:id])
    authorize @task_type
    @task_type.destroy

    respond_to do |format|
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def task_type_params
    params.require(:task_type).
      permit(
        :key,
        :use,
        :project_id,
        :abbreviation,
        translations_attributes: [:id, :locale, :label]
    )
  end
end
