class RegistryEntriesController < ApplicationController

  layout 'responsive'

  def create
    @registry_entry = RegistryEntry.create registry_entry_params
    respond_to do |format|
      format.json do
        render json: {
          id: @registry_entry.id,
          data_type: 'registry_entries',
          data: ::RegistryEntrySerializer.new(@registry_entry).as_json,
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
          data: ::RegistryEntrySerializer.new(@registry_entry).as_json,
        }
      end
    end
  end

  def index
    @registry_entries, extra_params = 
      if params[:children_for_entry] 
        [
          RegistryEntry.find(params[:children_for_entry]).children,
         "children_for_entry_#{params[:children_for_entry]}"
        ]
      elsif params[:references_for_segment]
        [
          Segment.find(params[:references_for_segment]).registry_entries,
         "references_for_segment_#{params[:references_for_segment]}"
        ]
      elsif params[:facets]
        [
          Project.registry_entry_search_facets.inject([]) do |mem, facet|
            mem << RegistryEntry.find_by_entry_code(facet['id'])
          end,
          'facets_true'
        ]
      else
        [RegistryEntry.all, nil]
      end

    respond_to do |format|
      format.html{ render 'react/app' }
      format.json do
        json = {
            data: @registry_entries.inject({}){|mem, s| mem[s.id] = Rails.cache.fetch("registry_entry-#{s.id}-#{s.updated_at}"){::RegistryEntrySerializer.new(s).as_json}; mem},
            data_type: 'registry_entries',
            extra_params: extra_params
        }.to_json
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
