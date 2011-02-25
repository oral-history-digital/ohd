class LocationReferencesController < BaseController

  actions :index

  skip_before_filter :authenticate_user!
  skip_before_filter :current_search
  skip_before_filter :init_search
  skip_before_filter :set_locale

  index do
    before do
      perform_search
    end
    wants.html do
      # this is only rendered when calling 'ortssuche.html' explicitly!
      # render :text => { 'results' => @results.map{|i| i.json_attrs } }.to_json
      render :action => :index
    end
    wants.json do
      # this is the response when calling 'ortssuche.json''
      render :json => { 'results' => @results.map{|i| i.json_attrs } }.to_json
    end
    wants.js do
      # this is the default response or when calling 'ortssuche.js'
      json = { 'results' => @results.map{|i| i.json_attrs } }.to_json
      render :js => params['callback'].blank? ? json : "#{params['callback']}(#{json});"
    end
  end


  private

  def perform_search
    query = {}
    query[:location] = Search.lucene_escape(params['location'])
    query[:longitude] = params['longitude']
    query[:latitude] = params['latitude']
    @location_search = LocationReference.search(query)
    @results = @location_search.results
  end

end