class TaskTypesController < ApplicationController

  def create
    authorize TaskType
    @task_type = TaskType.create task_type_params

    respond_to do |format|
      format.json do
        render json: {
          id: @task_type.id,
          data_type: 'task_types',
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
          id: @task_type.id,
          data_type: 'task_types',
          data: cache_single(@task_type),
        }
      end
    end
  end

  def index
    page = params[:page] || 1
    task_types = policy_scope(TaskType).where(search_params).order("created_at DESC").paginate page: page
    extra_params = search_params.update(page: page).inject([]){|mem, (k,v)| mem << "#{k}_#{v}"; mem}.join("_")

    respond_to do |format|
      format.html { render :template => '/react/app.html' }
      format.json do
        json = #Rails.cache.fetch "#{current_project.cache_key_prefix}-task_types-visible-for-#{current_user_account.id}-#{extra_params}-#{TaskType.maximum(:updated_at)}" do
          {
            data: task_types.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            data_type: 'task_types',
            extra_params: extra_params,
            page: params[:page], 
            result_pages_count: task_types.total_pages
          }
        #end
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

  def search_params
    params.permit(:label).to_h.select{|k,v| !v.blank? }
  end
end
