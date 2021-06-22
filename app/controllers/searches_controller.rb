class SearchesController < ApplicationController
  skip_before_action :authenticate_user_account!
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def facets
    json = Rails.cache.fetch "#{current_project.cache_key_prefix}-search-facets-#{RegistryEntry.maximum(:updated_at)}" do
      { facets: current_project.search_facets_hash }.to_json
    end

    respond_to do |format|
      format.json do
        render plain: json
      end
    end
  end

  def registry_entry
    search = RegistryEntry.search do
      fulltext params[:fulltext].blank? ? "emptyFulltextShouldNotResultInAllRegistryEntriesThisIsAComment" : params[:fulltext]
      #order_by(:names, :asc)
      paginate page: params[:page] || 1, per_page: 200
    end

    respond_to do |format|
      format.html do
        render :template => "/react/app.html"
      end
      format.json do
        render json: {
          result_pages_count: search.results.total_pages,
          results_count: search.total,
          registry_entries: search.results.map do |result|
            Rails.cache.fetch("#{current_project.cache_key_prefix}-registry_entry-#{result.id}-#{result.updated_at}-#{params[:fulltext]}") do
              cache_single(result, 'RegistryEntryWithAssociations')
            end
          end,
          fulltext: params[:fulltext],
        }
      end
    end
  end

  def search(model, order)
    model.search do
      fulltext params[:fulltext].blank? ? "emptyFulltextShouldNotResultInAllSegmentsThisIsAComment" : params[:fulltext] do
        current_project.available_locales.each do |locale|
          highlight :"text_#{locale}"
        end
      end
      with(:archive_id, params[:id])
      with(:workflow_state, (current_user_account && (current_user_account.admin? || current_user_account.roles?(current_project, 'General', 'edit'))) && model.respond_to?(:workflow_spec) ? model.workflow_spec.states.keys : "public")
      order_by(order, :asc)
      paginate page: params[:page] || 1, per_page: 2000
    end
  end

  def found_instances(model, search)
    search.hits.select { |h| h.instance }.map do |hit|
      instance = cache_single(hit.instance, model == Segment ? "SegmentHit" : nil)
      instance[:text] = highlighted_text(hit)
      instance
    end
  end

  def interview
    models_and_order = [
      [Segment, :sort_key],
      [BiographicalEntry, :start_date],
      [Photo, :id],
      [Person, "name_#{locale}".to_sym],
      [RegistryEntry, "text_#{locale}".to_sym],
    ]

    models_and_order.each do |model, order|
      instance_variable_set "@#{model.name.underscore}_search", search(model, order)
    end

    respond_to do |format|
      format.html do
        render :template => "/interviews/show"
      end
      format.json do
        interview = Interview.find_by_archive_id(params[:id])
        json = {
          fulltext: params[:fulltext],
          archiveId: params[:id],
        }

        models_and_order.each do |model, order|
          json["found_#{model.name.underscore.pluralize}"] = found_instances(model, instance_variable_get("@#{model.name.underscore}_search"))
        end

        render plain: json.to_json
      end
    end
  end

  def map
    respond_to do |format|
      format.html do
        render :template => "/react/app.html"
      end
      format.json do
        cache_key_date = [Interview.maximum(:updated_at), RegistryEntry.maximum(:updated_at), MetadataField.maximum(:updated_at)].max
        cache_key_permissions = current_user_account && (current_user_account.admin? || current_user_account.roles?(current_project, 'General', 'edit')) ? 'all' : 'public'

        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-map-search-#{cache_key_params}-#{cache_key_date}-#{cache_key_permissions}-#{params[:project_id]}" do
          registry_entries = RegistryEntry.for_map(I18n.locale, map_interviewee_ids)
          authorize registry_entries

          ActiveModelSerializers::SerializableResource.new(registry_entries,
            each_serializer: SlimRegistryEntryMapSerializer
          ).as_json
        end

        render json: json
      end
    end
  end

  def map_references
    respond_to do |format|
      format.json do
        registry_entry_id = params[:id]
        registry_references = RegistryReference.for_map_registry_entry(registry_entry_id, I18n.locale, map_interviewee_ids)
        authorize registry_references

        render json: registry_references, each_serializer: SlimRegistryReferenceMapSerializer
      end
    end
  end

  def map_reference_types
    respond_to do |format|
      format.json do
        registry_reference_types = RegistryReferenceType.for_map(I18n.locale)
        authorize registry_reference_types

        render json: registry_reference_types, each_serializer: SlimRegistryReferenceTypeMapSerializer
      end
    end
  end

  def archive
    respond_to do |format|
      format.html do
        render :template => "/react/app.html"
      end
      format.json do
        search = Interview.archive_search(current_user_account, current_project, locale, params)
        dropdown_values = Interview.dropdown_search_values(current_project, current_user_account)
        render json: {
          all_interviews_titles: dropdown_values[:all_interviews_titles],
          all_interviews_pseudonyms: dropdown_values[:all_interviews_pseudonyms],
          all_interviews_birth_locations: dropdown_values[:all_interviews_birth_locations],
          all_interviews_count: search.total,
          sorted_archive_ids: Rails.cache.fetch("#{current_project.cache_key_prefix}-sorted_archive_ids-#{Interview.maximum(:created_at)}") { Interview.archive_ids_by_alphabetical_order(locale) },
          result_pages_count: search.results.total_pages,
          results_count: search.total,
          interviews: search.results.map { |i| cache_single(i) },
          # found_segments_for_interviews: number_of_found_segments,
          # found_segments_for_interviews: found_segments,
          facets: current_project.updated_search_facets(search),
          page: params[:page] || 1,
        }
      end
      format.csv do
        search = Interview.archive_search(current_user_account, current_project, locale, params, 999999)
        desired_columns = current_project.list_columns.map(&:name)
        options = {col_sep: ";"}
        csv = CSV.generate(options) do |csv|
          csv << (desired_columns.map { |c| t("search_facets.#{c}") }).insert(0, t("title"))
          interviews = search.results.map { |i| cache_single(i) }
          interviews.each do |interview|
            values = (desired_columns.map { |c| interview[c].class == Hash ? interview[c][locale.to_s] : interview[c] }).insert(0, interview["short_title"][locale.to_s])
            csv << values
          end
        end
        send_data csv
      end
    end
  end

  private

  def map_interviewee_ids
    search = Interview.archive_search(current_user_account, current_project, locale, params, 1000)
    interviewee_ids = search.hits.map{|hit| hit.stored(:interviewee_id)}
    interviewee_ids
  end

  def highlighted_text(hit)
    current_project.available_locales.inject({}) do |mem, locale|
      mem[locale] = hit.highlights("text_#{locale}").inject([]) do |m, highlight|
        highlighted = highlight.format { |word| "<span class='highlight'>#{word}</span>" }
        m << highlighted.sub(/:/, "").strip()
        m
      end.join(" ").gsub("&nbsp;", " ").strip
      mem
    end
  end

  def icon(code)
    @iconhash ||= {
      # interview_location: ["microphone", "#98d441"],
      camp: ["circle-o", "#8b0f09"], # Lager und Haftstätten
      companie: ["industry", "#19196e"], # Firmen und Einsatzstellen
      birth_location: ["asterisk", "#59b4db"], #Geburtsort
      deportation_location: ["arrow-left", "#006939"], # Deportationsorte
      return_location: ["home", "#006939"], # Wohnorte ab 1945
      # place_of_death: ["bullseye", "#59b4db"],
      # home_location: ["home", "#59b4db"],
    }
    @iconhash[code.to_sym]
  end

  def link_element(interview, rrt, locale)
    pathBase = params[:project_id] ? "#{params[:project_id]}/#{locale}" : locale
    "<a href='/#{pathBase}/interviews/#{interview.archive_id}'>#{rrt.to_s(locale)} - #{interview.short_title(locale)} (#{interview.archive_id})<br/><small>#{interview.language.name(locale)}</small></a>"
  end

end
