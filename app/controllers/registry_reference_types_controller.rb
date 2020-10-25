class RegistryReferenceTypesController < ApplicationController

  def create
    authorize RegistryReferenceType
    @registry_reference_type = RegistryReferenceType.create(registry_reference_type_params)

    respond_to do |format|
      format.json do
        render json: data_json(@registry_reference_type, msg: "processed")
      end
    end
  end

  def show
    @registry_reference_type = RegistryReferenceType.find params[:id]
    authorize @registry_reference_type

    respond_to do |format|
      format.json do
        render json: data_json(@registry_reference_type)
      end
    end
  end

  def update
    @registry_reference_type = RegistryReferenceType.find params[:id]
    authorize @registry_reference_type
    @registry_reference_type.update_attributes registry_reference_type_params

    respond_to do |format|
      format.json do
        render json: data_json(@registry_reference_type, msg: "processed")
      end
    end
  end

  def destroy 
    @registry_reference_type = RegistryReferenceType.find(params[:id])
    authorize @registry_reference_type
    registry_reference_type = @registry_reference_type
    @registry_reference_type.destroy

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  def index
    page = params[:page] || 1
    registry_reference_types = policy_scope(RegistryReferenceType).where(search_params).order("created_at DESC").paginate page: page
    extra_params = search_params.update(page: page).inject([]){|mem, (k,v)| mem << "#{k}_#{v}"; mem}.join("_")

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        paginate = false
        json = #Rails.cache.fetch "#{current_project.cache_key_prefix}-registry_reference_types-#{params}-#{RegistryReferenceType.maximum(:updated_at)}" do
          {
            data: registry_reference_types.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
            data_type: "registry_reference_types",
            extra_params: extra_params,
            page: params[:page] || 1,
            result_pages_count: registry_reference_types.total_pages
          }
        #end
        render json: json
      end
    end
  end

  private

    def registry_reference_type_params
      params.require(:registry_reference_type).permit(
        :code,
        :registry_entry_id,
        translations_attributes: [:locale, :id, :name]
      )
    end

    def search_params
      params.permit(
        :name,
        :code
      ).to_h
    end
end
