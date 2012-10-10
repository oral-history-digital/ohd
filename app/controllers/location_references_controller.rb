class LocationReferencesController < BaseController

  PER_PAGE = 300

  actions :index

  layout :check_for_iframe_render
  IFRAME_ACTIONS = %w(map_frame map_test)

  skip_before_filter :check_user_authentication!
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
      render :json => { 'results' => @results.compact.map{|i| i.json_attrs.merge({ :id => i.id }) } }.to_json
    end
    wants.js do
      # this is the default response or when calling 'ortssuche.js'
      json = { 'results' => @results.compact.map{|i| i.json_attrs.merge({ :id => i.id }) } }.to_json
      render :js => params['callback'].blank? ? json : "#{params['callback']}(#{json});"
    end
  end

  def full_index
    response.headers['Cache-Control'] = "public, max-age=1209600"
    if params[:page].blank? || params[:page].to_i < 1
      # deliver number of pages
      @pages = (LocationReference.count(:all, :conditions => "duplicate IS NOT TRUE") / PER_PAGE).floor + 1
      respond_to do |wants|
        wants.html do
          render :text => @pages
        end
        wants.json do
          render :json => { 'pages' => @pages }
        end
        wants.js do
          json = { 'pages' => @pages }
          render :js => json
        end
      end
    else
      # deliver specified page
      @page = params[:page].to_i
      @results = LocationReference.find(:all, :conditions => "duplicate IS NOT TRUE", :limit => "#{(@page-1)*PER_PAGE},#{PER_PAGE}", :include => { :interview => :categories })
      respond_to do |wants|
        wants.html do
          render :action => :index
        end
        wants.json do
          render :json => { 'locations' => @results.map{|i| i.json_attrs(true) } }.to_json
        end
        wants.js do
          json = { 'locations' => @results.map{|i| i.json_attrs(true) } }.to_json
          render :js => json
        end
      end
    end
  end

  def map
  end

  def map_frame
    unless params['width'].blank? && params['height'].blank?
      @map_options = {}
      @map_options['width'] = params['width'].to_i unless params['width'].blank?
      @map_options['height'] = params['height'].to_i unless params['height'].blank?
    end
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

  def check_for_iframe_render
    # render iframe only on iframe actions
    if IFRAME_ACTIONS.include?(action_name.to_s)
      'iframe'
    else
      'application'
    end
  end

end