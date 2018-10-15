class RegistryEntriesController < BaseController

  layout 'responsive'

  def create
    @registry_entry = RegistryEntry.create_with_parent_and_name(registry_entry_params[:parent_id], registry_entry_params[:descriptor]) 
    clear_cache @registry_entry.parents.first

    respond_to do |format|
      format.json do
        render json: {
          id: @registry_entry.id,
          data_type: 'registry_entries',
          data: ::RegistryEntrySerializer.new(@registry_entry).as_json,
          reload_data_type: 'registry_entries',
          reload_id: @registry_entry.parents.first.id
        }
      end
    end
  end

  def show
    @registry_entry = RegistryEntry.find(params[:id])

    respond_to do |format|
      format.json do
        render json: {
          id: @registry_entry.id,
          data_type: 'registry_entries',
          data: Rails.cache.fetch("registry_entry-#{@registry_entry.id}-#{@registry_entry.updated_at}"){::RegistryEntrySerializer.new(@registry_entry).as_json},
        }
      end
    end
  end

  # TODO: test for multiple languages
  def update
    @registry_entry = RegistryEntry.find params[:id]
    # @registry_entry.update_attributes registry_entry_params
    @registry_entry.entry_code = @registry_entry.entry_desc = registry_entry_params[:descriptor]
    @registry_entry.save
    clear_cache @registry_entry.parents.first
    respond_to do |format|
      format.json do
        render json: {
          id: @registry_entry.id,
          data_type: 'registry_entries',
          data: Rails.cache.fetch("registry_entry-#{@registry_entry.id}-#{@registry_entry.updated_at}"){::RegistryEntrySerializer.new(@registry_entry).as_json},
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
      elsif params[:references_for_interview]
        [
          Interview.find_by_archive_id(params[:references_for_interview]).registry_references.where(registry_reference_type_id: params[:type_id]).map(&:registry_entry),
         "references_for_interview_#{params[:references_for_interview]}_type_id_#{params[:type_id]}"
        ]
      elsif params[:facets]
        [
          Project.registry_entry_search_facets.inject([]) do |mem, facet|
            mem << RegistryEntry.find_by_entry_code(facet['id'])
          end,
          'facets_true'
        ]
      else
        [RegistryEntry.where(entry_code: ['camps', 'companies', 'people']).map{|e| e.descendants.includes(registry_names: :translations)}.flatten.sort{|a,b| a.descriptor <=> b.descriptor}, nil]
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
      format.pdf do
        @locale = ISO_639.find(params[:locale]).send(Project.alpha).to_sym
        pdf =   render_to_string(:template => '/registry_entries/index.pdf.erb', :layout => 'latex.pdf.erbtex')
        send_data pdf, filename: "registry_entries_#{@locale}.pdf", :type => "application/pdf"#, :disposition => "attachment"
      end
    end
  end

  def destroy 
    @registry_entry = RegistryEntry.find(params[:id])
    parent = @registry_entry.parents.first
    @registry_entry.destroy

    clear_cache parent
    parent.touch
    parent.reload

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json do
        render json: {
          id: parent.id,
          data_type: 'registry_entries',
          data: Rails.cache.fetch("registry_entry-#{parent.id}-#{parent.updated_at}"){::RegistryEntrySerializer.new(parent).as_json},
        }, status: :ok 
      end
    end
  end

  private

  def registry_entry_params
    params.require(:registry_entry).permit(:workflow_state, :parent_id, :registry_name_type_id, :name_position, :descriptor, :notes)
  end

  #def registry_entry_params
    #params.require(:registry_entry).permit(:workflow_state, parents: [:id], registry_names_attributes: [:registry_name_type_id, :name_position, :descriptor, :notes])
  #end

end
