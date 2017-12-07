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
      fulltext params[:fulltext] 
      with(:archive_id, params[:id])
      #facet :chapter
    end

    respond_to do |format|
      format.html do
        render :template => '/interviews/show'
      end
      #format.js do
        #@interview = @search.results.first
      #end
      format.json do
        json = {
          found_segments: search.results.map{|i| Rails.cache.fetch("segment-#{i.id}-#{i.updated_at}"){::SegmentSerializer.new(i).as_json} },
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
        with(facet.to_sym, params[facet]) if params[facet]
      end
      facet *Project.search_facets_names
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

end
