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
              registry_entry = cache_single(result)
              ancestors = result.ancestors.inject({}) { |mem, a| mem[a.id] = cache_single(a); mem }
              { registry_entry: registry_entry, ancestors: ancestors, bread_crumb: result.bread_crumb }
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
        (current_project.available_locales + [:orig]).each do |locale|
          highlight :"text_#{locale}"
        end
      end
      with(:archive_id, params[:id])
      with(:workflow_state, (current_user_account && (current_user_account.admin? || current_user_account.roles?(Interview, :update))) && model.respond_to?(:workflow_spec) ? model.workflow_spec.states.keys : "public")
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
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-map-search-#{params}-#{RegistryEntry.maximum(:updated_at)}-#{Interview.maximum(:updated_at)}-#{MetadataField.maximum(:updated_at)}" do
          # define marker types
          registry_reference_type_codes = %w(birth_location deportation_location return_location company camp)
          selected_registry_reference_types = RegistryReferenceType.
            where(code: registry_reference_type_codes).
            joins(:metadata_fields).
            where("metadata_fields.use_in_map_search": true, "metadata_fields.project_id": current_project.id)

          top_registry_entries = RegistryEntry.where(code: %w(root)) | selected_registry_reference_types.map(&:registry_entry)

          # all registry_references with the defined registry_reference_type_codes have 'Person' as ref_object_type
          # so it is the interviewee
          #
          search = Interview.archive_search(current_user_account, current_project, locale, params, 1000)
          interviewees_ids = search.hits.map{|hit| hit.stored(:interviewee_id)}

          markers = selected_registry_reference_types.inject({}) do |mem, registry_reference_type|

            data = registry_reference_type.registry_references.includes(:registry_entry, interview: {language: :translations}).
              where.not("registry_entries.latitude": [nil, '']).
              where.not("registry_entries.longitude": [nil, '']).
              where(ref_object_id: interviewees_ids).
              group_by(&:registry_entry_id).map do |registry_entry_id, registry_references|

              links = registry_references.map{|rr| link_element(rr.interview, registry_reference_type, locale)}.join('<br/>')

              registry_entry = RegistryEntry.find(registry_entry_id)
              regions = (registry_entry.all_relatives(false) - top_registry_entries).map{|re| re.descriptor(locale)}
              {
                id: registry_entry_id,
                lat: registry_entry.latitude,
                lon: registry_entry.longitude,
                regions: regions,
                popup_text: "<strong title='#{registry_entry_id}'>#{registry_entry.descriptor(locale)}, #{regions.join(', ')}</strong><br/>#{links}",
                icon: "fa-#{icon(registry_reference_type.code) && icon(registry_reference_type.code)[0]}",
                icon_prefix: "fa",
                icon_color: icon(registry_reference_type.code) && icon(registry_reference_type.code)[1],
              }
            end

            mem[registry_reference_type.code] = {
              title: "<strong>#{registry_reference_type.to_s(locale)}</strong>",
              data: data
            }
            mem
          end

          {
            markers: markers,
            facets: current_project.updated_search_facets(search),
          }
        end

        render json: json
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

  def highlighted_text(hit)
    (current_project.available_locales + [:orig]).inject({}) do |mem, locale|
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
    "<a href='/de/interviews/#{interview.archive_id}'>#{rrt.to_s(locale)} - #{interview.short_title(locale)} (#{interview.archive_id})<br/><small>#{interview.language.name(locale)}</small></a>"
  end

end
