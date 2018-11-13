class SearchesController < ApplicationController

  layout 'responsive'

  skip_before_action :authenticate_user_account!
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def facets
    json = Rails.cache.fetch "search-facets-#{RegistryEntry.maximum(:updated_at)}" do
      {facets: Project.search_facets_hash}.to_json
    end

    respond_to do |format|
      format.json do
        render plain: json
      end
    end
  end

  def registry_entry
    search = RegistryEntry.search do 
      fulltext params[:fulltext].blank? ? "empty fulltext should not result in all registry_entries (this is a comment)" : params[:fulltext]
      #order_by(:names, :asc)
      paginate page: params[:page] || 1, per_page: 200
    end

    respond_to do |format|
      format.html do
        render :template => '/react/app.html'
      end
      format.json do
        json = {
          result_pages_count: search.results.total_pages,
          results_count: search.total,
          registry_entries: search.results.map do |result| 
            Rails.cache.fetch("registry_entry-#{result.id}-#{result.updated_at}-#{params[:fulltext]}") do 
              registry_entry = ::RegistryEntrySerializer.new(result).as_json 
              ancestors = result.ancestors.inject({}){|mem, a| mem[a.id] = ::RegistryEntrySerializer.new(a).as_json; mem }
              {registry_entry: registry_entry, ancestors: ancestors, bread_crumb: result.bread_crumb}
            end
          end,
          fulltext: params[:fulltext],
        }.to_json

        render plain: json
      end
    end
  end

  def search(model, order)
    model.search do 
      fulltext params[:fulltext].blank? ? "empty fulltext should not result in all segments (this is a comment)" : params[:fulltext]  do
        (Project.available_locales + [:orig]).each do |locale|
          highlight :"text_#{locale}"
        end
      end
      with(:archive_id, params[:id])
      order_by(order, :asc)
      paginate page: params[:page] || 1, per_page: 2000
    end
  end

  def found_instances(model, search)
    search.hits.select{|h| h.instance}.map do |hit| 
      Rails.cache.fetch("#{model.name.underscore}-#{hit.instance.id}-#{hit.instance.updated_at}-#{params[:fulltext]}") do 
        instance = "#{model.name}#{model == Segment ? 'Hit' : ''}Serializer".constantize.new(hit.instance).as_json 
        instance[:text] = highlighted_text(hit)
        instance
      end
    end
  end

  def interview
    models_and_order = [
      [Segment, :timecode],
      [BiographicalEntry, :start_date],
      [Photo, :id],
      [Person, "name_#{locale}".to_sym]
    ]
      
    models_and_order.each do |model, order|
      instance_variable_set "@#{model.name.underscore}_search", search(model, order)
    end

    respond_to do |format|
      format.html do
        render :template => '/interviews/show'
      end
      format.json do
        interview = Interview.find_by_archive_id(params[:id])
        json = {
          fulltext: params[:fulltext],
          archiveId: params[:id]
        }
          
        models_and_order.each do |model, order|
          json["found_#{model.name.underscore.pluralize}"] = found_instances(model, instance_variable_get("@#{model.name.underscore}_search"))
        end

        render plain: json.to_json
      end
    end
  end

  # https://github.com/sunspot/sunspot#stored-fields
  def all_interviews_titles
    search = Interview.search do
      adjust_solr_params do |params|
        params[:rows] = Interview.all.size
      end
    end
    search.hits.map{ |hit| eval hit.stored(:title) }
    # => [{:de=>"Fomin, Dawid Samojlowitsch", :en=>"Fomin, Dawid Samojlowitsch", :ru=>"Фомин Давид Самойлович"},
    #    {:de=>"Jusefowitsch, Alexandra Maximowna", :en=>"Jusefowitsch, Alexandra Maximowna", :ru=>"Юзефович Александра Максимовна"},
    #    ...]
  end

  # hagen only
  # in order to being able to get a dropdown list in search field
  def all_interviews_pseudonyms
    search = Interview.search do
      adjust_solr_params do |params|
        params[:rows] = Interview.all.size
      end
    end
    ps = search.hits.map{ |hit| {:de => RegistryEntry.find(hit.stored :pseudonym ).first.registry_names.first.try(:descriptor)} if hit.stored(:pseudonym).try(:first)}
    ps - [nil]
  end

  def all_interviews_places_of_birth
    search = Interview.search do
      adjust_solr_params do |params|
        params[:rows] = Interview.all.size
      end
    end
    search.hits.map {|hit| hit.stored(:place_of_birth) }
  end

  def archive
    search = Interview.search do
      fulltext params[:fulltext]
      Project.search_facets_names.each do |facet|
        with(facet.to_sym).any_of(params[facet]) if params[facet]
      end
      facet *Project.search_facets_names
      order_by("person_name_#{locale}".to_sym, :asc) if params[:fulltext].blank?
      # TODO: sort linguistically
      paginate page: params[:page] || 1, per_page: 12
    end

    # number_of_found_segments = search.hits.inject({}) do |mem, hit|
    #   segsearch = Segment.search do
    #     fulltext params[:fulltext].blank? ? "empty fulltext should not result in all segments (this is a comment)" : params[:fulltext]
    #     with(:archive_id, hit.instance.archive_id)
    #   end
    #   mem[hit.instance.archive_id] = segsearch.total
    #   mem
    # end

    # found_segments = search.hits.inject({}) do |mem, hit|
    #   segsearch = Segment.search do
    #     adjust_solr_params do |params|
    #       params[:rows] = 5
    #     end
    #     fulltext params[:fulltext].blank? ? "empty fulltext should not result in all segments (this is a comment)" : params[:fulltext] do
    #       highlight :transcript
    #       highlight :translation
    #     end
    #     with(:archive_id, hit.instance.archive_id)
    #   end

    #   interview = hit.instance
      
    #   mem[interview.archive_id] = {
    #     total: segsearch.total,
    #     segments: segsearch.hits.map do |hit| 
    #       # Rails.cache.fetch("segment-#{hit.instance.id}-#{hit.instance.updated_at}") do 
    #       segment = ::SegmentHitSerializer.new(hit.instance).as_json 
    #       segment[:transcripts] = highlighted_transcripts(hit, interview)
    #       segment
    #       # end
    #     end
    #   }
    #   mem
    # end

    respond_to do |format|
      format.html do
        render :template => '/react/app.html'
      end
      format.json do
        render json: {
            all_interviews_titles: all_interviews_titles,
            all_interviews_pseudonyms: all_interviews_pseudonyms,
            all_interviews_places_of_birth: all_interviews_places_of_birth,
            all_interviews_count: Interview.count,
            result_pages_count: search.results.total_pages,
            results_count: search.total,
            interviews: search.results.map{|i| cache_interview(i)},
            # found_segments_for_interviews: number_of_found_segments,
            # found_segments_for_interviews: found_segments,
            facets: Project.updated_search_facets(search),
        }
      end
    end
  end

  private

  def highlighted_text(hit) 
    (Project.available_locales + [:orig]).inject({}) do |mem, locale|
      # locale = hit.instance.orig_lang if locale == :orig
      mem[locale] = hit.highlights("text_#{locale}").inject([]) do |m, highlight|
        highlighted = highlight.format { |word| "<span class='highlight'>#{word}</span>" }
        m << highlighted.sub(/:/,"").strip()
        m
      end.join(' ').gsub("&nbsp;", " ").strip
      mem
    end
  end
end
