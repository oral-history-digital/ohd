class SearchesController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def facets
    search = Interview.archive_search(current_user, current_project, locale, params)
    facets = current_project ?
      current_project.updated_search_facets(search) :
      {}

    respond_to do |format|
      format.json do
        render json: { facets: facets }
      end
    end
  end

  def registry_entry
    search = RegistryEntry.search do
      fulltext params[:fulltext].blank? ? "emptyFulltextShouldNotResultInAllRegistryEntriesThisIsAComment" : params[:fulltext]
      with(:project_id, current_project.id)
      #order_by(:names, :asc)
      paginate page: params[:page] || 1, per_page: 200
    end

    respond_to do |format|
      format.html do
        render :template => "/react/app"
      end
      format.json do
        render json: {
          project: current_project.shortname,
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

  def search(model, order, field_name = 'text')
    search_term = params[:fulltext].blank? ? "emptyFulltextShouldNotResultInAllSegmentsThisIsAComment" : params[:fulltext]
    locales = current_project.available_locales
    locales += [:orig] if model == Segment && field_name == 'text'
    fields_to_search = locales.map { |locale| "#{field_name}_#{locale}".to_sym }

    model.search do
      fulltext search_term, fields: fields_to_search do
        locales.each do |locale|
          highlight :"#{field_name}_#{locale}"
        end
      end
      with(:archive_id, params[:id])
      with(:workflow_state, (current_user && (current_user.admin? || current_user.roles?(current_project, 'General', 'edit'))) && model.respond_to?(:workflow_spec) ? model.workflow_spec.states.keys : "public")
      order_by(order, :asc)
      paginate page: params[:page] || 1, per_page: 2000
    end
  end

  def found_instances(model, search, field_name = 'text')
    search.hits.select { |h| h.instance }.map do |hit|
      instance = cache_single(hit.instance, model == Segment ? "SegmentHit" : nil, nil, field_name)
      instance[:text] = highlighted_text(hit, field_name)
      instance
    end
  end

  def interview
    models_and_order = [
      [Segment, :sort_key],
      [BiographicalEntry, :start_date],
      [Photo, :id],
      [RegistryEntry, "text_#{locale}".to_sym],
      [Annotation, :id],
    ]

    models_and_order.each do |model, order|
      instance_variable_set "@#{model.name.underscore}_search", search(model, order)
    end
    @mainheading_search = search(Segment, :sort_key, 'mainheading')
    @subheading_search = search(Segment, :sort_key, 'subheading')
    @observations_search = search(Interview, :archive_id, 'observations')

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

        mainheadings = found_instances(Segment, @mainheading_search, 'mainheading')
        subheadings = found_instances(Segment, @subheading_search, 'subheading')

        all_headings = mainheadings.concat(subheadings)
        sorted_headings = all_headings.sort { |a, b| a[:sort_key] <=> b[:sort_key] }

        json['found_headings'] = sorted_headings
        json['found_observations'] = found_instances(Interview, @observations_search, 'observations')

        render plain: json.to_json
      end
    end
  end

  def map
    respond_to do |format|
      format.html do
        render :template => "/react/app"
      end
      format.json do
        cache_key_date = [Interview.maximum(:updated_at), RegistryEntry.maximum(:updated_at), MetadataField.maximum(:updated_at)].max
        scope = map_scope
        search = Interview.archive_search(current_user, current_project, locale, params, 10_000)

        json = Rails.cache.fetch "#{current_project.cache_key}-map-search-#{cache_key_params}-#{cache_key_date}-#{scope}" do
          registry_entries = RegistryEntry.for_map(map_interviewee_ids(search), map_interview_ids(search), scope)

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
        signed_in = current_user.present?
        scope = map_scope

        search = Interview.archive_search(current_user, current_project, locale, params, 10_000)
        interview_ids = map_interview_ids(search)
        repository = RegistryReferenceRepository.new

        interview_refs = repository.map_interview_references_for(registry_entry_id,
          map_interviewee_ids(search), interview_ids, scope)
        interview_refs_serialized = ActiveModelSerializers::SerializableResource.new(interview_refs,
          each_serializer: SlimInterviewRegistryReferenceSerializer,
          default_locale: current_project.default_locale,
          signed_in: signed_in)

        segment_refs = repository.map_segment_references_for(registry_entry_id,
          interview_ids, scope)
        segment_refs_serialized = ActiveModelSerializers::SerializableResource.new(segment_refs,
          each_serializer: SlimSegmentRegistryReferenceSerializer,
          default_locale: current_project.default_locale,
          signed_in: signed_in)

        references = {
          interview_references: interview_refs_serialized,
          segment_references: segment_refs_serialized
        }

        render json: references
      end
    end
  end

  def map_reference_types
    respond_to do |format|
      format.json do
        registry_reference_types = RegistryReferenceType.for_map(I18n.locale, current_project.id)

        render json: registry_reference_types, each_serializer: SlimRegistryReferenceTypeMapSerializer
      end
    end
  end

  def archive
    respond_to do |format|
      format.html do
        render :template => "/react/app"
      end
      format.json do
        search = Interview.archive_search(current_user, current_project, locale, params)
        render json: {
          result_pages_count: search.results.total_pages,
          results_count: search.total,
          interviews: search.results.map { |i| cache_single(i, current_user ? 'InterviewLoggedInSearchResult' : 'InterviewBase') },
          page: params[:page].to_i || 1,
          fulltext: params[:fulltext]
        }
      end
      format.csv do
        search = Interview.archive_search(current_user, current_project, locale, params, 999999)
        desired_columns = current_project.list_columns.map(&:name)
        options = {col_sep: "\t", quote_char: "\x00"}
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

  def suggestions
    respond_to do |format|
      format.json do
        dropdown_values = Interview.dropdown_search_values(current_project, current_user)
        cache_key_prefix = current_project.present? ? current_project.cache_key_prefix : 'OHD'
        render json: {
          all_interviews_titles: current_user ? dropdown_values[:all_interviews_titles] : [],
          all_interviews_pseudonyms: current_user ? dropdown_values[:all_interviews_pseudonyms] : [],
          sorted_archive_ids: Rails.cache.fetch("#{cache_key_prefix}-sorted_archive_ids-#{Interview.maximum(:created_at)}") { Interview.archive_ids_by_alphabetical_order(locale) },
        }
      end
    end
  end

  private

  def map_interviewee_ids(search)
    interviewee_ids = search.hits.map{|hit| hit.stored(:interviewee_id)}
    interviewee_ids
  end

  def map_interview_ids(search)
    interview_ids = search.hits.map { |hit| hit.primary_key.to_i }
    interview_ids
  end

  def map_scope
    show_all = ActiveModel::Type::Boolean.new.cast(params[:all])
    scope = show_all &&
            current_user &&
            (current_user.admin? || current_user.roles?(current_project, 'General', 'edit')) ?
            'all' : 'public'
  end

  def highlighted_text(hit, field_name = 'text')
    (current_project.available_locales | [:orig]).inject({}) do |mem, locale|
      mem[locale] = hit.highlights("#{field_name}_#{locale}").inject([]) do |m, highlight|
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
