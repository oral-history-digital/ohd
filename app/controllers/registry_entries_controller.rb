class RegistryEntriesController < ApplicationController
  skip_before_action :authenticate_user_account!, only: [:index, :show]

  def create
    authorize RegistryEntry
    @registry_entry = RegistryEntry.create(registry_entry_params)
    current_project.touch

    respond_to do |format|
      format.json do
        render json: {
          id: @registry_entry.id,
          data_type: "registry_entries",
          data: cache_single(@registry_entry),
          reload_data_type: "registry_entries",
          reload_id: @registry_entry.parents.first.id,
        }
      end
    end
  end

  def show
    @registry_entry = RegistryEntry.find(params[:id])
    authorize @registry_entry

    respond_to do |format|
      format.json do
        render json: {
          id: @registry_entry.id,
          data_type: "registry_entries",
          data: params[:with_associations] ? cache_single(@registry_entry, 'RegistryEntryWithAssociations') : cache_single(@registry_entry)
        }
      end
    end
  end

  # TODO: test for multiple languages
  def update
    @registry_entry = RegistryEntry.find params[:id]
    authorize @registry_entry
    @registry_entry.update_attributes registry_entry_params
    current_project.touch

    respond_to do |format|
      format.json do
        render json: {
          id: @registry_entry.id,
          data_type: "registry_entries",
          data: cache_single(@registry_entry),
        }
      end
    end
  end

  def index
    policy_scope RegistryEntry

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-registry_entries-#{params}-#{RegistryEntry.maximum(:updated_at)}" do
          registry_entries, extra_params =
            if params[:children_for_entry]
              [
                RegistryEntry.find(params[:children_for_entry]).children.includes([
                  :parent_registry_hierarchies,
                  {registry_names: :translations}
                ]).inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
                "children_for_entry_#{params[:children_for_entry]}",
              ]
            elsif params[:ref_object_type]
              [
                params[:ref_object_type].classify.constantize.find(params[:ref_object_id]).registry_entries.includes([
                  :parent_registry_hierarchies,
                  {registry_names: :translations}
                ]).inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
                "ref_object_type_#{params[:ref_object_type]}_ref_object_id_#{params[:ref_object_id]}",
              ]
            end

          #registry_entries = registry_entries.includes(registry_names: :translations)
          {
            data: registry_entries,
            data_type: "registry_entries",
            extra_params: extra_params,
          }
        end.to_json
        render plain: json
      end
      format.pdf do
        @locale = params[:lang]
        pdf = Rails.cache.fetch "#{current_project.cache_key_prefix}-registry-entries-pdf-#{params[:lang]}-#{RegistryName.maximum(:updated_at)}-#{RegistryEntry.maximum(:updated_at)}" do
          @registry_entries = RegistryEntry.pdf_entries(current_project)
          render_to_string(:template => "/registry_entries/index.pdf.erb", :layout => "latex.pdf.erbtex")
        end
        send_data pdf, filename: "registry_entries_#{params[:lang]}.pdf", :type => "application/pdf" #, :disposition => "attachment"
      end
      format.csv do
        root = params[:root_id] ? RegistryEntry.find(params[:root_id]) : current_project.registry_entries.where(code: 'root').first
        csv = Rails.cache.fetch "#{current_project.cache_key_prefix}-registry-entries-csv-#{root.id}-#{params[:lang]}-#{RegistryName.maximum(:updated_at)}-#{RegistryEntry.maximum(:updated_at)}" do
          CSV.generate(col_sep: "\t") do |row|
            row << ["Name des Elterneintrags", "ID des Elterneintrags", "Namen (id=descriptor=notes=position=type_code) getrennt durch Raute", "ID des Eintrags", "Latitude", "Longitude"]
            root.on_all_descendants do |entry|
              entry.parents.each do |parent|
                row << [parent && parent.descriptor(params[:lang]), parent && parent.id, entry.export_names(params[:lang]), entry.id, entry.latitude, entry.longitude]
              end
            end
          end
        end
        send_data csv, filename: "registry_entries_#{params[:lang]}.csv"
      end
    end
  end

  def merge
    @registry_entry = RegistryEntry.find(params[:id])
    authorize @registry_entry
    #policy_scope RegistryEntry
    RegistryEntry.merge({id: params[:id], ids: params[:merge_registry_entry][:ids]})
    current_project.touch

    respond_to do |format|
      format.json do
        render json: {
            data_type: 'registry_entries',
            msg: 'processing'
          }, status: :ok
      end
    end
  end

  def destroy
    @registry_entry = RegistryEntry.find(params[:id])
    authorize @registry_entry

    parent = @registry_entry.parents.first
    @registry_entry.destroy
    current_project.touch

    clear_cache parent
    parent.touch
    parent.reload

    respond_to do |format|
      format.html do
        render :action => "index"
      end
      format.json do
        render json: {
          id: parent.id,
          data_type: "registry_entries",
          data: Rails.cache.fetch("#{current_project.cache_key_prefix}-registry_entry-#{parent.id}-#{parent.updated_at}") { ::RegistryEntrySerializer.new(parent).as_json },
        }, status: :ok
      end
    end
  end

  private

  def registry_entry_params
    params.require(:registry_entry).permit(
      :workflow_state, 
      :parent_id, 
      :latitude, 
      :longitude, 
      registry_names_attributes: [
        :id,
        :registry_entry_id,
        :registry_name_type_id, 
        :name_position, 
        :descriptor, 
        :notes, 
        translations_attributes: [:locale, :id, :descriptor, :notes]
      ]
    )
  end
end
