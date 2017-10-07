class SearchesController < BaseController

  layout 'responsive'

  prepend_before_action :redirect_unauthenticated_users

  # Handle search initialization.
  before_action :rename_person_name_param, :only => :person_name
  skip_before_action :current_search_for_side_panel
  before_action :current_query_params

  before_action :determine_user, :only => [:query, :index]


  before_action :search_before_new, :only => [:new]
  before_action :search_before_index, :only => [:index]

  ACTIONS_FOR_DEFAULT_REDIRECT = ['person_name', 'interview']

  def query
    search
  end


  def search( reset=false )
    if reset
      @search = Search.from_params(nil)
    else
      @search = Search.from_params(@query_params || params)
    end
    @search.search!
    @search.segment_search!
    @search.open_category = params['open_category']
    @interviews = @search.results

    session[:query] = @search.query_params

    respond_to do |format|
      format.html do
        render :template => '/interviews/index.html'
      end
      format.json do
        serialized_unqueried_facets = @search.unqueried_facets.map() {|i| [{id: i[0], name: cat_name(i[0])}, i[1].map {|j| {entry: ::FacetSerializer.new(j[0]), count: j[1]}}]}

        render json: {
            all_interviews: Interview.count,
            interviews: @interviews.map{|i| ::InterviewSerializer.new(i) },
            found_segments_for_interviews:  @search.segments ,
            facets: {unqueried_facets: serialized_unqueried_facets, query_facets: @search.query_facets},
            session_query: session[:query],
            fulltext: (session[:query].blank? || session[:query]['fulltext'].blank?) ? "" : session[:query]['fulltext']
        }
      end
    end
  end



  def cat_name facet_id
    Project.is_category?(facet_id) ? (Project.category_name(facet_id.to_s, I18n.locale)) : (I18n.t(facet_id, :scope => :facets))
  end


  # Calculates a hash for the query parameters and redirects to this hash-url.
  # Note: this doesn't call the solr search engine!

  def search_before_new

    session[:query] = nil
    @query_hash = Search.from_params(params).query_hash
    url_params = {}
    search_params = {}
    search_params.merge!({:page => params[:page]}) unless params[:page].blank? || params[:page].to_i == 1
    search_params.merge!({:suche => @query_hash}) unless @query_hash.blank?
    unless params[:referring_controller].blank? || params[:referring_action].blank?
      url_params = {
          :controller => params[:referring_controller],
          :action => params[:referring_action]
      }
    end
    @redirect = if url_params.empty?
                  if @query_hash.blank?
                    search_url(search_params)
                  else
                    search_by_hash_url(search_params)
                  end
                else
                  url_for(url_params.merge(search_params))
                end
  end


  def new
    respond_to do |format|
      format.html do
        redirect_to(@redirect)
      end
      format.js do
        render js: "if(window.location == '#{@redirect}'){ window.location.reload(true);} else { window.location = '#{@redirect}' }"
      end
      format.json do
        search true
      end
    end
  end

  #new_action.flash nil

  def search_before_index
    @search = Search.from_params(@query_params || params)
    @search.search!
    @search.segment_search!
    @search.open_category = params['open_category']
    @interviews = @search.results
    session[:query] = @search.query_params
  end

  def index
    respond_to do |format|
      format.html do
        render template: '/interviews/index.html'
      end
      format.js
    end
  end

  def interview
    @search = Search.in_interview(params[:id], params[:fulltext])
    @search.segment_search!
    archive_id = @search.results.first.nil? ? '' : @search.results.first.archive_id
    @segments = @search.matching_segments_for(archive_id)
    respond_to do |format|
      format.html do
        render :template => '/interviews/show'
      end
      format.js do
        @interview = @search.results.first
      end
      format.json do
        # TODO: just to test. rm following line afterwards.
        #
        # found_segments_for_interviews = {}
        # found_segments_for_interviews[params[:id]] =  @segments.map {|segment| ::SegmentSerializer.new(segment)}
        #
        # render json: {found_segments_for_interviews: found_segments_for_interviews}
        #

        render json: {found_segments: @segments.map {|segment| ::SegmentSerializer.new(segment)}}
      end
    end
  end

  def person_name
    @search = Search.from_params(params)
    begin
      @search.search!
    rescue Sunspot
      @search.results = []
    end
    respond_to do |format|
      format.json do
        render :json => @search.results.map {|pn| pn.full_title(I18n.locale)}.reject(&:blank?)
      end
    end
  end

  private

  def rename_person_name_param
    params.merge!({:partial_person_name => params.delete('term')})
  end

  # redirect users to login if they're unauthenticated
  # even on AJAX requests
  def redirect_unauthenticated_users
    unless signed_in?(:user_account)
      set_locale
      flash[:alert] = t(:unauthenticated_search, :scope => 'devise.sessions', :locale => I18n.locale)
      session[:query] = Search.from_params(params).query_params
      if ACTIONS_FOR_DEFAULT_REDIRECT.include?(action_name)
        session[:"user_account.return_to"] = new_search_url
      else
        session[:"user_account.return_to"] = request.url
      end
      if request.xhr?
        if request.accepts.include? Mime.const_get(:JSON)
          # Send a special autocomplete list that can be intercepted.
          render :json => [{:label => "redirect_to", :value => new_user_account_session_url}]
        else
          render :js => "window.location.href = '#{new_user_account_session_url}';"
        end
      else
        redirect_to new_user_account_session_url
      end
    end
  end

  # Override the usual handling of session before parameters in side-panel searches
  # here: local params override session!
  def current_query_params
    @query_params = Search.from_params(params).query_params
    @query_params = session[:query] || {} if @query_params.empty?
    @query_params.delete(:page) if @query_params[:page] == 1
    @query_params
  end

end
