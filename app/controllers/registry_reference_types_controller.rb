class RegistryReferenceTypesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :global]

  def create
    authorize RegistryReferenceType
    @registry_reference_type = RegistryReferenceType.create(registry_reference_type_params)

    respond @registry_reference_type
  end

  def show
    @registry_reference_type = RegistryReferenceType.find params[:id]
    authorize @registry_reference_type

    respond @registry_reference_type
  end

  def update
    @registry_reference_type = RegistryReferenceType.find params[:id]
    authorize @registry_reference_type
    @registry_reference_type.update registry_reference_type_params

    respond @registry_reference_type
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
    policy_scope RegistryReferenceType
    @component = 'RegistryReferenceTypes'

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        paginate = false
        json = Rails.cache.fetch "#{current_project.shortname}-rrt-#{cache_key_params}-#{RegistryReferenceType.count}-#{RegistryReferenceType.maximum(:updated_at)}" do
          if params[:for_projects]
            data = policy_scope(RegistryReferenceType).
              includes(:translations, :project).
              order("registry_reference_type_translations.name ASC")
            extra_params = "for_projects_#{current_project.id}"
          else
            page = params[:page] || 1
            data = policy_scope(RegistryReferenceType).
              includes(:translations, :project).
              where(search_params).order("registry_reference_type_translations.name ASC").
              paginate(page: page)
            paginate = true
            extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
          end
          {
            data: data.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            nested_data_type: 'registry_reference_types',
            data_type: 'projects',
            id: current_project.id,
            extra_params: extra_params,
            page: params[:page] || 1,
            result_pages_count: paginate ? data.total_pages : nil,
          }
        end
        render json: json
      end
    end
  end

  def global
    ref_types = Project.ohd.registry_reference_types
    authorize ref_types

    respond_to do |format|
      format.json do
        render json: ref_types, each_serializer: RegistryReferenceTypeSerializer
      end
    end
  end

  private

    def respond registry_reference_type
      respond_to do |format|
        format.json do
          render json: {
            nested_id: registry_reference_type.id,
            data: cache_single(registry_reference_type),
            nested_data_type: "registry_reference_types",
            data_type: 'projects',
            id: current_project.id,
          }
        end
      end
    end

    def registry_reference_type_params
      params.require(:registry_reference_type).permit(
        :code,
        :registry_entry_id,
        :use_in_transcript,
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
