class TaskTypesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]

  def create
    authorize TaskType
    @task_type = TaskType.create task_type_params

    respond @task_type
  end

  def update
    @task_type = TaskType.find params[:id]
    authorize @task_type
    @task_type.update task_type_params

    respond @task_type
  end

  def index
    policy_scope(TaskType)

    respond_to do |format|
      format.html { render :template => '/react/app' }
      format.json do
        json = Rails.cache.fetch "#{current_project.shortname}-#{current_user.id}-#{cache_key_params}-#{TaskType.count}-#{TaskType.maximum(:updated_at)}" do
          if params[:for_projects]
            data = policy_scope(TaskType).
              includes(:translations, :project).
              order("task_type_translations.label ASC")
            extra_params = "for_projects_#{current_project.id}"
          else
            page = params[:page] || 1
            data = policy_scope(TaskType).
              includes(:translations, :project).
              where(search_params).order("task_type_translations.label ASC").
              paginate(page: page)
            paginate = true
            extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
          end
          {
            data: data.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            nested_data_type: 'task_types',
            data_type: 'projects',
            id: current_project.id,
            extra_params: extra_params,
            page: params[:page], 
            result_pages_count: paginate ? data.total_pages : nil
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

  def search_params
    params.permit(:label).to_h.select{|k,v| !v.blank? }
  end
end
