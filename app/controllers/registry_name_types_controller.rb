class RegistryNameTypesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]

  def create
    authorize RegistryNameType
    @registry_name_type = RegistryNameType.create(registry_name_type_params)

    respond @registry_name_type
  end

  def show
    @registry_name_type = RegistryNameType.find params[:id]
    authorize @registry_name_type

    respond @registry_name_type
  end

  def update
    @registry_name_type = RegistryNameType.find params[:id]
    authorize @registry_name_type
    @registry_name_type.update registry_name_type_params

    respond @registry_name_type
  end

  def destroy 
    @registry_name_type = RegistryNameType.find(params[:id])
    authorize @registry_name_type
    registry_name_type = @registry_name_type
    @registry_name_type.destroy

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  def index
    policy_scope RegistryNameType

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        paginate = false
        json = Rails.cache.fetch "#{current_project.shortname}-registry_name_types-#{cache_key_params}-#{RegistryNameType.count}-#{RegistryNameType.maximum(:updated_at)}" do
          if params[:for_projects]
            data = current_project.registry_name_types.
              order("name ASC")
            extra_params = "for_projects_#{current_project.id}"
          else
            page = params[:page] || 1
            data = current_project.registry_name_types.
              where(search_params).
              order("name ASC").
              paginate(page: page)
            paginate = true
            extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
          end

          {
            data: data.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
            data_type: "registry_name_types",
            extra_params: extra_params,
            page: params[:page] || 1,
            result_pages_count: paginate ? data.total_pages : nil,
          }
        end
        render json: json
      end
    end
  end

  private

    def respond registry_name_type
      respond_to do |format|
        format.json do
          render json: {
            nested_id: registry_name_type.id,
            data: cache_single(registry_name_type),
            nested_data_type: "registry_name_types",
            data_type: 'projects',
            id: current_project.id,
          }
        end
      end
    end

    def registry_name_type_params
      params.require(:registry_name_type).permit(
        :code,
        :name,
        :project_id,
        translations_attributes: [:locale, :id, :name]
      )
    end

    def search_params
      params.permit(
        :name,
        :code
      ).to_h.select{|k,v| !v.blank? }
    end
end
