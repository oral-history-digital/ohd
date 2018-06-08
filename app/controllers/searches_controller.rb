class SearchesController < BaseController

  layout 'responsive'

  skip_before_action :authenticate_user_account!

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

  def interview
    search = Segment.search do 
      fulltext params[:fulltext].blank? ? "empty fulltext should not result in all segments (this is a comment)" : params[:fulltext]  do
        (Project.available_locales + [:orig]).each do |locale|
          highlight :"text_#{locale}"
        end
      end
      with(:archive_id, params[:id])
      #facet :chapter
      order_by(:timecode, :asc)
      paginate page: params[:page] || 1, per_page: 2000
    end

    respond_to do |format|
      format.html do
        render :template => '/interviews/show'
      end
      format.json do
        interview = Interview.find_by_archive_id(params[:id])
        json = {
          found_segments: search.hits.map do |hit| 
            Rails.cache.fetch("segment-#{hit.instance.id}-#{hit.instance.updated_at}-#{params[:fulltext]}") do 
              segment = ::SegmentHitSerializer.new(hit.instance).as_json 
              segment[:transcripts] = highlighted_transcripts(hit)
              segment
            end
          end,
          fulltext: params[:fulltext],
          archiveId: params[:id]
        }.to_json

        render plain: json
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

  def archive
    search = Interview.search do
      fulltext params[:fulltext]
      Project.search_facets_names.each do |facet|
        with(facet.to_sym).any_of(params[facet]) if params[facet]
      end
      facet *Project.search_facets_names
      order_by("person_name_#{locale}".to_sym, :asc) if params[:fulltext].blank?
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
            all_interviews_count: Interview.count,
            result_pages_count: search.results.total_pages,
            results_count: search.total,
            interviews: search.results.map{|i| Rails.cache.fetch("interview-#{i.id}-#{i.updated_at}"){::InterviewSerializer.new(i).as_json} },
            # found_segments_for_interviews: number_of_found_segments,
            # found_segments_for_interviews: found_segments,
            facets: Project.updated_search_facets(search),
        }
      end
    end
  end

  private

  def highlighted_transcripts(hit) 
    (Project.available_locales + [:orig]).inject({}) do |mem, locale|
      locale = orig_lang if locale == :orig
      mem[locale] = hit.highlights("text_#{locale}").inject([]) do |m, highlight|
        highlighted = highlight.format { |word| "<span class='highlight'>#{word}</span>" }
        m << highlighted.sub(/:/,"").strip()
        m
      end.join(' ').gsub("&nbsp;", " ").strip
      mem
    end
  end
end
