class RegistryReferenceTypesController < ApplicationController

  def create
    @registry_reference_type = RegistryReferenceType.create(registry_reference_type_params)
    clear_cache @registry_reference_type 

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'registry_reference_types',
          id: @registry_reference_type.id,
          data: ::RegistryReferenceTypeSerializer.new(@registry_reference_type).as_json
        }
      end
    end
  end

  def update
    @registry_reference_type = RegistryReferenceType.find params[:id]
    @registry_reference_type.update_attributes registry_reference_type_params
    clear_cache @registry_reference_type 

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'registry_reference_types',
          id: @registry_reference_type.id,
          data: ::RegistryReferenceTypeSerializer.new(@registry_reference_type).as_json
        }
      end
    end
  end

  def destroy 
    @registry_reference_type = RegistryReferenceType.find(params[:id])
    registry_reference_type = @registry_reference_type
    @registry_reference_type.destroy
    clear_cache registry_reference_type 

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  def index
    # @registry_reference_types = RegistryReferenceType.all

    # Vorschlag: es werden nur Referenztypen zurückgegeben die Teil der registry_reference_type_search_facets sind 
    # (Könnte später auf Teil der person_properties_with_source_registry_reference_type geändert werden):
    @registry_reference_types = RegistryReferenceType.where(code: Project.registry_reference_type_search_facets.map{|f| f['id'] })

    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "registry_reference_types-#{RegistryReferenceType.maximum(:updated_at)}" do
          {
            data: @registry_reference_types.inject({}){|mem, s| mem[s.id] = Rails.cache.fetch("registry_entry-#{s.id}-#{s.updated_at}"){::RegistryReferenceTypeSerializer.new(s).as_json}; mem},
            data_type: 'registry_reference_types',
        }
        end.to_json
        render plain: json
      end
    end
  end

  private

    def registry_reference_type_params
      params.require(:registry_reference_type).permit(:name)
    end

end
