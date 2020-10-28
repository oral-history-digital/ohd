class MetadataFieldsController < ApplicationController
  before_action :set_metadata_field, only: [:update, :destroy]

  def create
    authorize MetadataField
    @metadata_field = MetadataField.create metadata_field_params
    @metadata_field.project.touch

    respond_to do |format|
      format.json do
        render json: {
          id: @metadata_field.project_id,
          data_type: 'projects',
          nested_data_type: 'metadata_fields',
          nested_id: @metadata_field.id,
          data: cache_single(@metadata_field),
        }
      end
    end
  end

  def update
    @metadata_field.update_attributes(metadata_field_params)
    @metadata_field.project.touch

    respond_to do |format|
      format.json do
        render json: {
          id: @metadata_field.project_id,
          data_type: 'projects',
          nested_data_type: 'metadata_fields',
          nested_id: @metadata_field.id,
          data: cache_single(@metadata_field, nil, "project"),
        }
      end
    end
  end

  def index
    @project = Interview.find_by_archive_id(params[:project_id])
    policy_scope(MetadataField)
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch("#{current_project.cache_key_prefix}-project-metadata_fields-#{@project.id}-#{@project.metadata_fields.maximum(:updated_at)}") do
          {
            data: @project.metadata_fields_for.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            nested_data_type: 'metadata_fields',
            data_type: 'projects',
            id: params[:project_id]
          }
        end
        render json: json
      end
    end
  end

  def destroy
    @metadata_field = MetadataField.find(params[:id])
    project = @metadata_field.project
    @metadata_field.destroy
    project.touch

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.js
      format.json { render json: data_json(project, msg: 'processed') }
    end
  end

  def show
    @metadata_field = MetadataField.find(params[:id])
    authorize @metadata_field
    respond_to do |format|
      format.json do
        render json: data_json(@metadata_field)
      end
    end
  end

  private

    def set_metadata_field
      @metadata_field = MetadataField.find(params[:id])
      authorize @metadata_field
    end

    def metadata_field_params
      params.require(:metadata_field).permit(
        "project_id",
        "name",
        "locale",
        "use_as_facet",
        "facet_order",
        "use_in_results_table",
        "use_in_results_list",
        "list_columns_order",
        "use_in_details_view",
        "use_in_map_search",
        "display_on_landing_page",
        "ref_object_type",
        "source",
        "values",
        "registry_entry_id",
        "registry_reference_type_id",
        translations_attributes: [:locale, :label, :id]
      )
    end
end
