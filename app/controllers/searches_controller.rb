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
              registry_entry = ::RegistryEntrySerializer.new(result).as_json
              ancestors = result.ancestors.inject({}) { |mem, a| mem[a.id] = ::RegistryEntrySerializer.new(a).as_json; mem }
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

  def archive
    search = Interview.archive_search(current_user_account, current_project, locale, params)
    dropdown_values = Interview.dropdown_search_values(current_project, current_user_account)

    respond_to do |format|
      format.html do
        render :template => "/react/app.html"
      end
      format.json do
        render json: {
          all_interviews_titles: dropdown_values[:all_interviews_titles],
          all_interviews_pseudonyms: dropdown_values[:all_interviews_pseudonyms],
          all_interviews_birth_locations: dropdown_values[:all_interviews_birth_locations],
          all_interviews_count: search.total,
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
        desired_columns = current_project.list_columns.map(&:name)
        options = {}
        csv = CSV.generate(options) do |csv|
          csv << (desired_columns.map { |c| t("search_facets.#{c}") }).insert(0, t("title"))
          search.results.each do |interview|
            values = (desired_columns.map { |c| interview.send(*c) }).insert(0, interview.localized_hash[locale])
            # binding.pry
            values = values.map { |v|
              v.class.to_s == "Array" ? v.map { |id| RegistryEntry.find(id).to_s(locale) }.join(",") : v
            }
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
      mem
    end
  end
end
