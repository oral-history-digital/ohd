class LocationReferencesController < BaseController

  actions :index

  skip_before_filter :authenticate_user!
  skip_before_filter :current_search
  skip_before_filter :init_sidepanel_search

  index do
    before do
      store_query_in_session if current_user.nil?
      perform_search
    end
    wants.html do
      # this is only rendered when calling 'ortssuche.html' explicitly!
      # render :text => { 'results' => @results.map{|i| i.json_attrs } }.to_json
      render :action => :index
    end
    wants.json do
      # this is the response when calling 'ortssuche.json''
      render :json => { 'results' => @results.map{|i| i.json_attrs.merge({ :id => i.id }) } }.to_json
    end
    wants.js do
      # this is the default response or when calling 'ortssuche.js'
      json = { 'results' => @results.map{|i| i.json_attrs.merge({ :id => i.id }) } }.to_json
      render :js => params['callback'].blank? ? json : "#{params['callback']}(#{json});"
    end
  end

  def full_index
    @results = LocationReference.find(:all)
    response.headers['Cache-Control'] = "public, max-age=1209600"
    wants.html do
      render :action => :index
    end
    wants.json do
      render :json => { 'locations' => @results.map{|i| i.json_attrs } }.to_json
    end
    wants.js do
      json = { 'locations' => @results.map{|i| i.json_attrs } }.to_json
      render :js => json
    end
  end

  def map

  end

  def map1
    
  end

  private

  # language= parameter overrides all
  def set_locale
    @locale = params[:language] || params[:locale] || session[:locale] || 'de'
    session[:locale] = @locale
    I18n.locale = @locale
    I18n.load_path += Dir[ File.join(RAILS_ROOT, 'lib', 'locale', '*.{rb,yml}') ]
  end

  def query(paginate=false)
    query = {}
    query[:location] = Search.lucene_escape(params['location'])
    query[:longitude] = params['longitude'] unless params['longitude'].blank?
    query[:latitude] = params['latitude'] unless params['latitude'].blank?
    query[:longitude2] = params['longitude2'] unless params['longitude2'].blank?
    query[:latitude2] = params['latitude2'] unless params['latitude2'].blank?
    query[:page] = params[:page] || 1 if !params[:page].blank? || paginate
    puts "\n@@@ QUERY: #{query.inspect}"
    query
  end

  def perform_search
    paginate = request.xhr? ? false : true
    @location_search = LocationReference.search(query(paginate))
    @results = @location_search.results
  end

  def store_query_in_session
    session[:landing_page_url] = request.request_uri
  end

end