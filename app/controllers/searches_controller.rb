class SearchesController < BaseController

  actions :new, :index

  prepend_before_filter :redirect_unauthenticated_users

  # handle search initialization specifically
  before_filter :current_query_params
  skip_before_filter :current_search_for_side_panel

  before_filter :remove_search_term_from_params

  def query
    @search = Search.from_params(@query_params || params)
    @search.search!
    #reinstate_category_state
    @search.segment_search!
    @search.open_category = params['open_category']
    @interviews = @search.results

    session[:query] = @search.query_params

    respond_to do |format|
      format.html do
        render :template => '/interviews/index.html'
      end
      format.js do
        #puts "\n\n@@@ SEARCH open category: #{@search.open_category}"
        results_html = render_to_string({ :template => '/interviews/index.html', :layout => false })
        service_html = render_to_string({ :partial => '/searches/search.html', :object => @search })
        search_facets_html = render_to_string({ :partial => '/searches/facets.html', :object => @search })
        render :update do |page|
          page.replace_html 'innerContent', results_html
          page.replace_html 'baseServices', service_html
          page.replace_html 'baseContainerRight', search_facets_html
          # page << "setQueryHashInURL('#{@search.query_hash}');"
        end
      end
    end
  end

#  create do
#    before do
#      @search = Search.from_params(@query_params || params)
#      @search.search!
#      #reinstate_category_state
#      @search.segment_search!
#      @search.open_category = params['open_category']
#      @interviews = @search.results
#
#      session[:query] = @search.query_params
#    end
#    wants.html do
#      render :template => '/interviews/index.html'
#    end
#    wants.js do
#      #puts "\n\n@@@ SEARCH open category: #{@search.open_category}"
#      results_html = render_to_string({ :template => '/interviews/index.html', :layout => false })
#      service_html = render_to_string({ :partial => '/searches/search.html', :object => @search })
#      search_facets_html = render_to_string({ :partial => '/searches/facets.html', :object => @search })
#      render :update do |page|
#        page.replace_html 'innerContent', results_html
#        page.replace_html 'baseServices', service_html
#        page.replace_html 'baseContainerRight', search_facets_html
#        # page << "setQueryHashInURL('#{@search.query_hash}');"
#      end
#    end
#    failure.wants.js do
#      #puts "\n\n@@@ SEARCH open category: #{@search.open_category}"
#      results_html = render_to_string({ :template => '/interviews/index.html', :layout => false })
#      service_html = render_to_string({ :partial => '/searches/search.html', :object => @search })
#      search_facets_html = render_to_string({ :partial => '/searches/facets.html', :object => @search })
#      render :update do |page|
#        page.replace_html 'innerContent', results_html
#        page.replace_html 'baseServices', service_html
#        page.replace_html 'baseContainerRight', search_facets_html
#        # page << "setQueryHashInURL('#{@search.query_hash}');"
#      end
#    end
#  end
#
#  create.flash nil

  # calculates a hash for the query parameters and redirects to this hash-url
  # Note: this doesn't call the lucene search engine!
  new_action do
    before do
      # The session query search is NOT used here at all!
      session[:query] = nil
      @query_hash = Search.from_params(params).query_hash
      url_params = {}
      search_params = {}
      search_params.merge!({:page => params[:page]}) unless params[:page].blank? || params[:page].to_i == 1
      search_params.merge!({:suche => @query_hash }) unless @query_hash.blank?
      unless params[:referring_controller].blank? || params[:referring_action].blank?
        url_params = {
            :controller => params[:referring_controller],
            :action => params[:referring_action]
        }
      end
      @redirect = if url_params.empty?
          if @query_hash.blank?
            query_searches_url(search_params)
          else
            search_by_hash_url(search_params)
          end
        else
          url_for(url_params.merge(search_params))
        end
    end
    wants.html do
      redirect_to(@redirect)
    end
    wants.js do
      # either change the location or reload:
      render :update do |page|
        page << "if(window.location == '#{@redirect}'){ window.location.reload(true);} else { window.location = '#{@redirect}' }"
      end
    end
  end

  new_action.flash nil

  index do
    before do
      @search = Search.from_params(@query_params || params)
      #puts "\n REFRESH QUERY PARAMS: #{@search.query_params.inspect}"
      #puts "REFRESH SEARCH: #{@search.inspect}"
      @search.search!
      #reinstate_category_state
      @search.segment_search!
      @search.open_category = params['open_category']
      @interviews = @search.results

      session[:query] = @search.query_params

    end
    wants.html do
      render :template => '/interviews/index.html'
    end
    wants.js do
      #puts "\n\n@@@ SEARCH open category: #{@search.open_category}"
      results_html = render_to_string({ :template => '/interviews/index.html', :layout => false })
      service_html = render_to_string({ :partial => '/searches/search.html', :object => @search })
      search_facets_html = render_to_string({ :partial => '/searches/facets.html', :object => @search })
      render :update do |page|
        page.replace_html 'innerContent', results_html
        page.replace_html 'baseServices', service_html
        page.replace_html 'baseContainerRight', search_facets_html
      end
    end
  end

  def interview
    @search = Search.in_interview(params[:id],params[:fulltext])
    @search.segment_search!
    archive_id = @search.results.first.nil? ? '' : @search.results.first.archive_id
    @segments = @search.matching_segments_for(archive_id)
    respond_to do |format|
      format.html do
        render :template => '/interviews/show'
      end
      format.js do
        render :partial => '/interviews/segments.html'
      end
    end
  end

  def person_name
    query_params = params.merge({:partial_person_name => params.delete('person_name')})
    @search = Search.from_params(query_params)
    begin
      @search.search!
    rescue Sunspot
      @search.results = []
    end
    respond_to do |format|
      format.html do
        # ?
      end
      format.js do
        if @search.results.empty?
          render :text => '<span>keine Personen gefunden</span>'
        else
          render :partial => 'person_name', :collection => @search.results
        end
      end
    end
  end

  # saves a search as user_content
  def save
    @user = current_user
    attributes = { :user_id => @user.id, :persistent => true }
    object_params.each_pair{|k,v| attributes[k.to_sym] = ActiveSupport::JSON.decode(v)}
    puts "\n@@@ SEARCH ATTR:\n#{attributes.inspect}\n@@@\n"
    @search = Search.create(attributes)
    puts "\n\n@@@@ SAVED SEARCH:\n#{@search.inspect}\n#{@search.errors.full_messages}\n@@@@\n"
    @user_content = @search
    respond_to do |format|
      format.html do
        render :partial => "save"
      end
      format.js do
        render :partial => "save"
      end
    end
  end

  private

  # redirect users to login if they're unauthenticated
  # even on AJAX requests
  def redirect_unauthenticated_users
    unless signed_in?(:user_account)
      flash[:alert] = t('unauthenticated_search', :scope => 'devise.sessions', :locale => session[:locale] || I18n.locale)
      session[:query] = Search.from_params(params).query_params
      session[:"user_account.return_to"] = request.request_uri
      if request.xhr?
        render :update do |page|
          page << "window.location.href = '#{new_user_account_session_url}';"
        end
      else
        redirect_to new_user_account_session_url
      end
    end
  end

  # This method clears the default search field contents from the query
  # on the server-side, in case this is missed by the JS client code.
  def remove_search_term_from_params
    unless params.blank? || params[:fulltext].blank?
      params.delete(:fulltext) if params[:fulltext] == t('search_term')
    end
  end

  # This method parses the reinstate[] parameter (array) to set the
  # category settings on the current search (preferrably after conducting the search).
  def reinstate_category_state
    unless params[:reinstate].blank? || !params[:reinstate].is_a?(Array)

      params[:reinstate].each do |category_param|

        category = category_param.sub(/_\d+$/,'')
        id = category_param[/\d+$/].to_i

        if @search.respond_to?(category)

          @search.send("#{category}=", (@search.send(category) || []) << id)

        end

      end

    end
  end

  # override the usual handling of session before parameters in side-panel searches
  # here: local params override session!
  def current_query_params
    @query_params = Search.from_params(params).query_params
    @query_params = session[:query] || {} if @query_params.empty?
    @query_params.delete(:page) if @query_params[:page] == 1
    @query_params
  end
  
end