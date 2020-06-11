class SearchesController < ApplicationController
  layout "responsive"

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
      with(:workflow_state, (current_user_account && (current_user_account.admin? || current_user_account.user.roles?(Interview, :update))) && model.respond_to?(:workflow_spec) ? model.workflow_spec.states.keys : "public")
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
        # define marker types
        codes = %w(birth_location deportation_location camp companie return_location)

        # scaffold hash structure to build on
        hash = Rails.cache.fetch("#{current_project.cache_key_prefix}-registry-reference-types-for-map-#{RegistryReferenceType.maximum(:updated_at)}-#{MetadataField.maximum(:updated_at)}") do
          entries = RegistryEntry.root_node.children.select{ |child| child if child.code.in?(codes) }
          types = current_project.metadata_fields.where(use_in_details_view: true).map{|mf|mf.registry_reference_type}.select{|rrt| rrt if rrt && rrt.code.in?(codes)}
          (entries + types).inject({}){|mem, et|
            mem[et.code] = {
              title: "<strong>#{name(et)[:de]}</strong>",
              data:  [], 
            }
            mem
          }
        end

        # do the search and get the interviews
        search = Interview.archive_search(current_user_account, current_project, locale, params, 1000)
        interviews = search.results.map { |i| cache_single(i)}


        interviews.each do |interview|
          # go through the registry_references of each interview and its interviewee
          interviewee = cache_single(Interview.find(interview["id"]).interviewee)
          (interview["registry_references"].merge interviewee["registry_references"]).each do |key, rr|
            if rr["registry_reference_type_id"] 
              rrt = cache_single(RegistryReferenceType.find(rr["registry_reference_type_id"]))
              r = cache_single(RegistryEntry.find(rr["registry_entry_id"]))
              regions_string = r["regions"].size > 0 ? "(#{r["regions"].try(:reverse).try(:join, ", ")})" : ""
              
              # what code should we use?
              if rrt["code"].in?(codes) # = registry reference type
                code = rrt["code"]
              elsif (r["ancestors"].map{|a|a[1]["code"]} & codes).size > 0 # = registry entry
                code = (r["ancestors"].map{|a|a[1]["code"]} & codes)[0]
              end

              # fill the hash
              if code && r["latitude"] && r["latitude"].to_i != 0
                if hash[code][:data].select{|h| h[:id] == r["id"]}.size > 0
                  popup_text = hash[code][:data].select{|h| h[:id] == r["id"]}[0][:popup_text]
                  new_popup_text = link_element(interview, rrt)
                  new_popup_text.in?(popup_text) || popup_text = popup_text + "<br/>" + new_popup_text
                  hash[code][:data].select{|h| h[:id] == r["id"]}[0][:popup_text] = popup_text
                else
                  hash[code][:data] = hash[code][:data].push({
                    id: r["id"],
                    lat: r["latitude"],
                    lon: r["longitude"],
                    regions:r["regions"],
                    popup_text: "<strong title='#{r["id"]}'>#{r["name"]["de"]} #{regions_string}</strong><br/>#{link_element(interview, rrt)}",
                    icon: "fa-#{icon(code) && icon(code)[0]}",
                    icon_prefix: "fa",
                    icon_color: icon(code) && icon(code)[1],
                  })
                end
              end
            end
          end
        end
        # render json: hash
        render json: {
          markers: hash,
          facets: current_project.updated_search_facets(search),
        }
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
      # locale = hit.instance.orig_lang if locale == :orig
      mem[locale] = hit.highlights("text_#{locale}").inject([]) do |m, highlight|
        highlighted = highlight.format { |word| "<span class='highlight'>#{word}</span>" }
        m << highlighted.sub(/:/, "").strip()
        m
      end.join(" ").gsub("&nbsp;", " ").strip
    end
  end

  def icon(code)
    iconhash = {
      # interview_location: ["microphone", "#98d441"],
      camp: ["circle-o", "#8b0f09"], # Lager und Haftstätten
      companie: ["industry", "#19196e"], # Firmen und Einsatzstellen
      birth_location: ["asterisk", "#59b4db"], #Geburtsort
      deportation_location: ["arrow-left", "#006939"], # Deportationsorte
      return_location: ["home", "#006939"], # Wohnorte ab 1945
      # place_of_death: ["bullseye", "#59b4db"],
      # home_location: ["home", "#59b4db"],
    }
    iconhash[code.to_sym]
  end

  def name(category)
    Rails.cache.fetch("#{current_project.cache_key_prefix}-name-for-map-#{category.class.to_s}-#{category.id}-#{category.updated_at}-#{MetadataField.maximum(:updated_at)}") do
      case category.class.to_s
      when "RegistryEntry"
        category.try(:localized_hash, :descriptor)
      when "RegistryReferenceType"
        MetadataField.where(name: category.code, source: 'RegistryReferenceType').first.try(:localized_hash, :label) || category.try(:localized_hash, :name)
      end
    end
  end

  def link_element(interview, rrt)
    "<a href='/de/interviews/#{interview["archive_id"]}'>#{rrt["name"]["de"]} - #{interview["short_title"]["de"]} (#{interview["archive_id"]})<br/><small>#{interview["language"]["de"]}</small></a>"
  end

end