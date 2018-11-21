class RegistryHierarchiesController < ApplicationController

  layout 'responsive'

  def create
    authorize RegistryHierarchy
    @registry_hierarchy = RegistryHierarchy.create(registry_hierarchy_params) 
    descendant = @registry_hierarchy.descendant
    ancestor = @registry_hierarchy.ancestor

    clear_cache descendant
    clear_cache ancestor

    respond_to do |format|
      format.json do
        render json: {
          id: descendant.id,
          data_type: 'registry_entries',
          data: Rails.cache.fetch("#{Project.project_id}-registry_entry-#{descendant.id}-#{descendant.updated_at}"){::RegistryEntrySerializer.new(descendant).as_json},
          reload_data_type: 'registry_entries',
          reload_id: ancestor.id
        }, status: :ok 
      end
    end
  end

  def destroy 
    @registry_hierarchy = RegistryHierarchy.find(params[:id])
    authorize @registry_hierarchy
    descendant = @registry_hierarchy.descendant
    ancestor = @registry_hierarchy.ancestor

    @registry_hierarchy.destroy

    clear_cache descendant
    clear_cache ancestor

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json do
        render json: {
          id: descendant.id,
          data_type: 'registry_entries',
          data: Rails.cache.fetch("#{Project.project_id}-registry_entry-#{descendant.id}-#{descendant.updated_at}"){::RegistryEntrySerializer.new(descendant).as_json},
          reload_data_type: 'registry_entries',
          reload_id: ancestor.id
        }, status: :ok 
      end
    end
  end

  private

  def registry_hierarchy_params
    params.require(:registry_hierarchy).permit(:descendant_id, :ancestor_id)
  end

end
