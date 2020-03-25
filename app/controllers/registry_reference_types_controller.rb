class RegistryReferenceTypesController < ApplicationController

  def create
    policy_scope RegistryReferenceType
    @registry_reference_type = RegistryReferenceType.create(registry_reference_type_params)

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
    authorize @registry_reference_type
    @registry_reference_type.update_attributes registry_reference_type_params

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
    @registry_reference_types = policy_scope(RegistryReferenceType).where(code: current_project.registry_reference_type_metadata_fields.map(&:name))

    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-registry_reference_types-#{RegistryReferenceType.maximum(:updated_at)}-#{current_project.metadata_fields.maximum(:updated_at)}" do
          {
            data: @registry_reference_types.inject({}){|mem, s| mem[s.id] = Rails.cache.fetch("#{current_project.cache_key_prefix}-registry_entry-#{s.id}-#{s.updated_at}-#{current_project.metadata_fields.maximum(:updated_at)}"){::RegistryReferenceTypeSerializer.new(s).as_json}; mem},
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
