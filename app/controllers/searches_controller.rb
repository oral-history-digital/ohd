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
        highlight :transcript
        highlight :translation
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
            Rails.cache.fetch("segment-#{hit.instance.id}-#{hit.instance.updated_at}") do 
              segment = ::SegmentHitSerializer.new(hit.instance).as_json 
              segment[:transcripts] = highlighted_transkripts(hit, interview)
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

  def archive
    search = Interview.search do
      fulltext params[:fulltext] 
      Project.search_facets_names.each do |facet|
        with(facet.to_sym).any_of(params[facet]) if params[facet]
      end
      facet *Project.search_facets_names
      order_by("person_name_#{locale}".to_sym, :asc)
      paginate page: params[:page] || 1, per_page: 12
    end

    respond_to do |format|
      format.html do
        render :template => '/react/app.html'
      end
      format.json do
        render json: {
            all_interviews_count: Interview.count,
            result_pages_count: search.results.total_pages,
            results_count: search.total,
            interviews: search.results.map{|i| Rails.cache.fetch("interview-#{i.id}-#{i.updated_at}"){::InterviewSerializer.new(i).as_json} },
            #found_segments_for_interviews:  serialized_segments ,
            facets: Project.updated_search_facets(search),
        }
      end
    end
  end

  private

  def highlighted_transkripts(hit, interview) 
    {
      de: :translation, 
      "#{interview.language.code[0..1]}": :transcript
    }.inject({}) do |mem, (locale, meth)|
      mem[locale.to_s] = hit.highlights(meth).inject([]) do |m, highlight|
        highlighted = highlight.format { |word| "<span class='highlight'>#{word}</span>" }
        m << highlighted.sub(/:/,"").strip()
        m
      end.join(' ').gsub("&nbsp;", " ").strip
      mem
    end
  end
end
