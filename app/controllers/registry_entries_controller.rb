class RegistryEntriesController < ApplicationController

  def create
    @registry_entry = RegistryEntry.create registry_entry_params
    respond_to do |format|
      format.json do
        render json: {
          id: @registry_entry.id,
          data_type: 'registry_entries',
          data: ::RegistryEntrySerializer.new(@registry_entry),
        }
      end
    end
  end

  def update
    @registry_entry = RegistryEntry.find params[:id]
    @registry_entry.update_attributes registry_entry_params
    respond_to do |format|
      format.json do
        render json: {
          id: @registry_entry.id,
          data_type: 'registry_entries',
          data: ::RegistryEntrySerializer.new(@registry_entry),
        }
      end
    end
  end

  def index
    #@registry_entries, extra_params = 
      #if params[:children_for_entry] 
        #[
          #RegistryEntry.find(params[:children_for_entry]).children,
         #"children_for_entry_#{params[:children_for_entry]}"
        #]
      #elsif params[:facets]
        #[
          #Project.registry_entry_search_facets.inject([]) do |mem, facet|
            #mem << RegistryEntry.find_by_entry_code(facet['id'])
          #end,
          #'facets_true'
        #]
        ##parents = RegistryEntry.where(id: params[:parent_ids])
        ##@registry_entries = parents.inject([]){|children, p| children += p.children; children}
      #else
        #[RegistryEntry.all, nil]
      #end

    @registry_entries = params[:children_for_entry] ?
      RegistryEntry.find(params[:children_for_entry]).children :
      RegistryEntry.all

    respond_to do |format|
      format.json do
        json = #Rails.cache.fetch "registry_entries-#{RegistryEntry.maximum(:updated_at)}" do
          {
            data: @registry_entries.inject({}){|mem, s| mem[s.id] = Rails.cache.fetch("registry_entry-#{s.id}-#{s.updated_at}"){::RegistryEntrySerializer.new(s).as_json}; mem},
            data_type: 'registry_entries',
            extra_params: "children_for_entry_#{params[:children_for_entry]}"
        }.to_json
        #end.to_json
        render plain: json
      end
    end
  end

  def destroy 
    @registry_entry = RegistryEntry.find(params[:id])
    @registry_entry.destroy

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.js
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def registry_entry_params
    params.require(:registry_entry).  permit(:name, :parent_id, :notes)
  end

end
