class RegistryEntriesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]
  skip_after_action :verify_authorized, only: [:norm_data_api]
  skip_after_action :verify_policy_scoped, only: [:norm_data_api]

  def norm_data_api
    results = NormDataApi.new(params[:expression], params[:place_type], params[:geo_filter]).process

    respond_to do |format|
      format.json do
        render json: JSON.parse(results).to_json
      end
    end
  end


  def create
    authorize RegistryEntry
    @registry_entry = RegistryEntry.create(registry_entry_params)
    @registry_entry.project_id = current_project.id
    @registry_entry.save validate: false # there is an ancestor validation from somewhere producing invalid entries
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
          data: params[:with_associations] ? cache_single(@registry_entry, serializer_name: 'RegistryEntryWithAssociations') : cache_single(@registry_entry)
        }
      end
    end
  end

  # TODO: test for multiple languages
  def update
    @registry_entry = RegistryEntry.find params[:id]
    authorize @registry_entry
    @registry_entry.update registry_entry_params
    @registry_entry.touch
    current_project.touch

    respond_to do |format|
      format.json do
        render json: {
          id: @registry_entry.id,
          data_type: "registry_entries",
          data: cache_single(@registry_entry.reload),
        }
      end
    end
  end

  def index
    policy_scope RegistryEntry
    cache_key_date = [RegistryName.maximum(:updated_at), RegistryEntry.maximum(:updated_at), current_project.updated_at].max.strftime('%s')

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        json = Rails.cache.fetch "#{current_project.shortname}-re-#{cache_key_params}-#{cache_key_date}-#{RegistryEntry.count}" do
          registry_entries, extra_params =
            if params[:children_for_entry]
              [
                RegistryEntry.find(params[:children_for_entry]).children.includes([
                  :parent_registry_hierarchies,
                  {registry_names: [:translations, :registry_name_type]}
                ]).inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
                "children_for_entry_#{params[:children_for_entry]}",
              ]
            elsif params[:ref_object_type]
              [
                params[:ref_object_type].classify.constantize.find(params[:ref_object_id]).registry_entries.includes([
                  :parent_registry_hierarchies,
                  {registry_names: [:translations, :registry_name_type]}
                ]).inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
                "ref_object_type_#{params[:ref_object_type]}_ref_object_id_#{params[:ref_object_id]}",
              ]
            end

          {
            data: registry_entries,
            data_type: "registry_entries",
            extra_params: extra_params,
          }
        end.to_json
        render plain: json
      end
      format.pdf do
        pdf = Rails.cache.fetch "#{current_project.shortname}-registry-entries-pdf-#{params[:lang]}-#{cache_key_date}" do
          render_to_string(
            template: 'registry_entries/index',
            formats: :pdf,
            layout: 'latex',
            locals: {
              locale: params[:lang],
              project: current_project,
              registry_entries: RegistryEntry.pdf_entries(current_project)
            }
          )
        end
        send_data pdf, filename: "registry_entries_#{params[:lang]}.pdf", type: "application/pdf" #, :disposition => "attachment"
      end
      format.csv do
        if current_user && (current_user.admin? || current_user.roles?(current_project, 'RegistryEntry', 'show'))
          root = params[:root_id] ? RegistryEntry.find(params[:root_id]) : current_project.root_registry_entry
          csv = Rails.cache.fetch "#{current_project.shortname}-registry-entries-csv-#{root.id}-#{params[:lang]}-#{cache_key_date}" do
            CSV.generate(col_sep: "\t", quote_char: "\x00") do |row|
              row << ['parent_name', 'parent_id', 'name', 'id', 'description', 'latitude', 'longitude', 'GND ID', 'OSM ID', 'Verknüpfte Interviews', 'Status']
              root.on_all_descendants do |entry|
                entry.parents.each do |parent|
                  row << [
                    parent && parent.descriptor(params[:lang]),
                    parent && parent.id,
                    entry.descriptor(params[:lang]),
                    entry.id,
                    entry.notes(params[:lang]) && entry.notes(params[:lang]).gsub(/[\r\n\t]/, ''),
                    entry.latitude,
                    entry.longitude,
                    entry.gnd_id && entry.gnd_id.gsub(/[\r\n\t]/, ''),
                    entry.osm_id && entry.osm_id.gsub(/[\r\n\t]/, ''),
                    entry.registry_references.map(&:archive_id).compact.uniq.join('#'),
                    entry.workflow_state,
                  ]
                end
              end
            end
          end
          send_data csv, filename: "registry_entries_#{current_project.shortname}_#{params[:lang]}_#{Date.today.strftime('%Y_%m_%d')}.csv"
        else
          redirect_to user_url('current')
        end
      end
    end
  end

  def tree
    registry_entries = RegistryEntry.for_tree(I18n.locale, current_project.id)
    authorize registry_entries

    respond_to do |format|
      format.json do
        render json: registry_entries, each_serializer: SlimRegistryEntrySerializer
      end
    end
  end

  def global_tree
    registry_entries = RegistryEntry.for_tree(I18n.locale, Project.ohd.id)
    authorize registry_entries

    respond_to do |format|
      format.json do
        render json: registry_entries, each_serializer: SlimRegistryEntrySerializer
      end
    end
  end

  def merge
    @registry_entry = RegistryEntry.find(params[:id])
    authorize @registry_entry
    first_merged_entry_parent = RegistryEntry.find(params[:merge_registry_entry][:ids].first).parents.first
    RegistryEntry.merge({id: params[:id], ids: params[:merge_registry_entry][:ids]})
    current_project.touch

    respond_to do |format|
      format.json do
        render json: {
          id: @registry_entry.id,
          data_type: "registry_entries",
          data: cache_single(@registry_entry),
          reload_data_type: "registry_entries",
          reload_id: first_merged_entry_parent.id
        }
      end
    end
  end

  def destroy
    @registry_entry = RegistryEntry.find(params[:id])
    authorize @registry_entry

    parent = @registry_entry.parents.first
    @registry_entry.destroy if @registry_entry.children.count == 0
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
          data: Rails.cache.fetch("#{current_project.shortname}-registry_entry-#{parent.id}-#{parent.updated_at}") { ::RegistryEntrySerializer.new(parent).as_json },
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
      norm_data_attributes: [
        :id,
        :registry_entry_id,
        :norm_data_provider_id,
        :nid
      ],
      registry_names_attributes: [
        :id,
        :registry_entry_id,
        :registry_name_type_id,
        :name_position,
        translations_attributes: [:locale, :id, :descriptor]
      ],
      translations_attributes: [
        :locale,
        :id,
        :notes
      ]
    )
  end
end
