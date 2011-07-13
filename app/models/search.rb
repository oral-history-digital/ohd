# The Search class is used to encapsulate Solr searches in a
# resource-oriented manner. This allows a user session to
# carry a state across the application. The base state is
# the default search over all records, and this is cached in
# a class variable Search#@@default_search.
#
# The Search#RESULTS_PER_PAGE constant sets the pagination
# default number of hits per page.
#
# A Search can be constructed from a params hash using
# the class method Search#from_params.
#
# The search query is run against Solr by calling the
# Search#search! method. This instantiates all the
# result-based variables (hits, results, facets).
#
#
# The Search#segment_search! method runs a subsearch
# for fulltext matching in segments, and populates the
# matching_segments accordingly.
#
# Segment#matching_segments_for maps the matching segments per
# archive_id.

class Search < ActiveRecord::Base

  require 'yaml'
  require 'base64'

  RESULTS_PER_PAGE = 12

  FACET_FIELDS = [
                      :person_name,
                      :forced_labor_groups,
                      :forced_labor_fields,
                      :forced_labor_habitations,
                      :languages,
                      :countries
  ]

  # This contains a list of accessible attributes that are not
  # considered query params and will not be kept in a stored search.
  NON_QUERY_ACCESSIBLES = [
                      :open_category
  ]

  class_eval <<ATTR
    attr_accessible :#{(FACET_FIELDS \
                            + NON_QUERY_ACCESSIBLES \
                            + [
                                :fulltext,
                                :partial_person_name,
                                :page
                              ]).join(', :')}
ATTR

  QUERY_PARAMS = Search.accessible_attributes - NON_QUERY_ACCESSIBLES.map{|a| a.to_s }

  IGNORE_SEARCH_TERMS = [
    I18n.t('search_term', :scope => 'user_interface.search', :locale => :de),
    I18n.t('search_term', :scope => 'user_interface.search', :locale => :en)
  ]

  # Accessors for each query param *except* *fulltext*
  # (fulltext is actually the keywords search DB column.
  (Search.accessible_attributes - [ 'fulltext' ]).each do |query_param|
    class_eval <<DEF
    # This is the generated setter for accessing the
    # #{query_param} query conditions.
    def #{query_param}=(#{query_param}_query)
      if #{query_param}_query.blank?
        @#{query_param}= nil
      else
        @#{query_param}=#{query_param}_query
      end
    end

    def #{query_param}
      @#{query_param}
    end

DEF
  end


  def results=(solr_result)
    @results = solr_result
    # not sure we should store results!
    # write_attribute :results, @results.to_yaml
  end

  # Returns the Sunspot::Search#results of any queries
  # performed via Search#search!.
  def results
    @results ||= read_attribute :results
    @results = YAML.load(@results) if @results.is_a?(String)
    @results
  end

  # used to construct the autocomplete searches for person names
  def partial_person_name=(name_token)
    @partial_person_name = name_token
  end

  def partial_person_name
    @partial_person_name
  end

  # filter the ignore (default label) words from fulltext
  def fulltext=(term)
    write_attribute(:fulltext, term) unless IGNORE_SEARCH_TERMS.include?(term)
  end

  # The total number of records matching the query criteria
  # as returned by Solr. Defaults to zero if Search#search!
  # hasn't been called.
  def hits
    @hits ||= 0
  end

  # The query parameters used to initialize the search. This represents
  # the current facets for the search.
  def query
    @query || {}
  end

  # The query parameters in hashed form.
  def query_hash
    @query_hash ||= Search.encode_parameters(query_params)
    @query_hash
  end

  def page
    @page
  end

  # Returns an array of facets that are actively filtered on in the current query.
  def query_facets
    @query_facets ||= query.select{|f| f.is_a?(Array) && FACET_FIELDS.include?(f.first.to_sym) }
  end

  # Returns an array of facets that are not specified in the current query.
  def unqueried_facets
    (FACET_FIELDS - query_facets.map{|f| f.first.to_sym }).map{|f| [ f, facet(f) ] }
  end

  # The facet method returns an array of facet rows in the
  # format: <tt>[ category_instance, count ]</tt>.
  def facet(name)
    @facets ||= {}
    facet_name = name
    facet_name = (name.to_s.singularize << "_ids") unless Category::ARCHIVE_CATEGORIES.assoc(name.to_sym).nil?
    @facets[facet_name.to_sym] ||= \
    if @search.is_a?(Sunspot::Search)
      facet = @search.facet(facet_name.to_sym)
      # puts "FACET NAME: #{facet_name}  => #{facet}"
      if facet.blank?
        []
      elsif facet.rows.blank?
        if Category::ARCHIVE_CATEGORIES.flatten.include?(facet_name.to_sym)
          # yield all categories with a count of zero
          Category.send(name).map{|c| [ c, 0 ]}
        else
          []
        end
      elsif facet.rows.first.instance.nil?
        # non-category facet - return an array of all values and counts
        facet.rows.map{|f| [ f.value, f.count ]}
      else
        # category facet - return an array of all instances with number of corresponding hits
        facet.rows.map{|f| [ f.instance, f.count ] }.sort{|a,b| a.first.name <=> b.first.name }
      end
    else
      []
    end
  end

  # Returns the query params - this is needed for link generation from a given query, for instance.
  def query_params
    query = {}
    QUERY_PARAMS.each do |query_param|
      query_value = self.send(query_param)
      query[query_param] = query_value unless query_value.nil?
    end
    query
  end

  # Returns a string-serialized version of the query params for use as
  # url parameters.
  def serialized_query_params(include_page=true)
    query_params.to_a.map do |param|
      str = []
      next if param.first.to_s == 'page' && !include_page
      if param.last.is_a?(Array)
        # this is an Array field
        param.last.each do |value|
          str << param.first.to_s + '[]=' + value.to_s
        end
      else
        str << param.first.to_s + '=' + param.last.to_s
      end
      str.join('&')
    end.join('&')
  end

  # This method queries the Solr search server for matching
  # instances of interviews/segments.
  #
  # Because of search index corruption on Passenger restarts
  # (or due to other, unidentified problems) a refactoring is
  # currently being done to instantiate the blank searches
  # directly from the DB
  def search!
    current_query_params = query_params

    #handle the page parameter separately
    @page = (current_query_params.delete('page') || 1).to_i

    if current_query_params.blank?
      @search = blank_search(@page)

    else
      if current_query_params['partial_person_name'].blank?
        # fulltext search
        @search = standard_lucene_search current_query_params, @page

      else
        # search for partial person names for autocompletion
        @search = person_name_search current_query_params, @page

      end
    end
    @hits = @search.total
    @results = @search.results

    # facets are populated from the search lazily
    @facets = nil
    @query = current_query_params.select{|k,v| !v.nil? }
    @query_facets = nil
    @query_hash = nil
    @segments = {}
    # puts "\n@@@@@\nSEARCH! -> #{@hits} hits found\nquery_params = #{current_query_params.inspect}\nQUERY: #{@query.inspect}\n\nRESULTS:\n#{@results.inspect}\n@@@@@\n\n"
    @search
  end

  # this is for test purposes only
  def search_for_keyword(word)
    Sunspot.search Interview do

      keywords word.downcase

      adjust_solr_params do |p|
        p.delete(:defType)
      end

    end
  end


  def matching_segments_for(archive_id)
    archive_id.upcase! if archive_id.is_a?(String)
    match = @segments.is_a?(Hash) ? (@segments[archive_id] || []) : []
    # puts "\n\n@@@@ MATCHING SEGMENTS FOR #{archive_id.inspect}:\n#{match.inspect}"
    match
  end


  # Performs a sub-search for matching segments on the facetted search
  # result set.
  def segment_search!
    @segments = {}
    fulltext = self.query_params['fulltext']

    interview_ids = @results.map{|i| i.archive_id }
    unless fulltext.blank? || interview_ids.empty?
      subsearch = Sunspot.search Segment do

        # keyword search on fulltext only - for DisMax queries
        # keywords fulltext.downcase #do
        #  highlight :transcript, :translation
        #end

        with(:archive_id).any_of interview_ids

        paginate :page => 1, :per_page => 120

        order_by :timecode, :asc

        # lucene search
        adjust_solr_params do |params|
          params[:defType] = 'lucene'
          #params[:qt] = 'standard'
          
          # fulltext search
          unless fulltext.blank?
            params[:q] = fulltext.downcase
          end
        end

      end

      # puts "\nSEGMENT SUBSEARCH: #{subsearch.query.to_params.inspect}\nfound #{subsearch.total} segments."

      # puts "\n\n@@@@ RAW RESULTS:"
      # first_seg = subsearch.hits.select{|h| h.class_name != 'Interview' }.first
      # puts "First Segment = #{first_seg.primary_key}: #{first_seg.to_s}"  unless first_seg.nil?

      # iterate over results, not subsearch!

      @results.each do |interview|


        subsearch.hits.select{|h| h.instance.archive_id == interview.archive_id }.each do |segment_result|

          segment = segment_result.instance
          #puts "Highlights for segment: #{segment.media_id} = #{segment_result.highlights('translation').inspect}"

           if @segments[interview.archive_id.upcase].is_a?(Array)
             @segments[interview.archive_id.upcase] << segment
           else
             @segments[interview.archive_id.upcase] = [ segment ]
           end

        end


      end

    end
  end


  def self.from_params(query_params=nil)
    if query_params.blank?
      if !defined?(@@default_search_cache_time) || (Time.now - @@default_search_cache_time > 1.hour)
        @@default_search = nil
        @@default_search_cache_time = Time.now
      end
      @@default_search ||= begin Search.new{|base| base.search! }; rescue Exception; Search.new; end;
    else
      search_params = query_params['suche'].blank? ? {} : Search.decode_parameters(query_params.delete('suche'))
      search_params.merge!(query_params)
      search = Search.new do |search|
        QUERY_PARAMS.each do |attr|
          # puts "-> setting search query param: #{attr} = #{query_params[attr]}"
          search.send(attr+'=', search_params[attr.to_s]) unless search_params[attr.to_s].blank?
          # puts "search.#{attr} = #{search.send(attr.to_s)}"
        end
      end
      # puts "Search.query_params = #{search.query_params}"
      search
    end
  end

  def self.in_interview(id, fulltext)
    search_results = if id.is_a?(Integer)
      Interview.find(:all, :conditions => ['id = ?', id])
    else
      Interview.find(:all, :conditions => ['archive_id = ?', id])
    end
    Search.new do |search|
      search.results = search_results
      search.fulltext = fulltext
    end
  end

  private

  # the default blank search - nothing but facets
  def blank_search(page=1)
    Sunspot.search Interview do

      facet :person_name,
            :forced_labor_group_ids,
            :forced_labor_field_ids,
            :forced_labor_habitation_ids,
            :language_ids,
            :country_ids

      paginate :page => Search.valid_page_number(page), :per_page => RESULTS_PER_PAGE
      order_by :person_name, :asc

    end
  end

  # normal interview search
  def standard_search(query, page=1)
    # SOLR query
    Sunspot.search Interview do

      # fulltext search
      unless query['fulltext'].blank?
        keywords Unicode.downcase(query['fulltext'])
      end

      # person name facet
      unless query['person_name'].blank?
        self.with :person_name, query['person_name']
      end

      # category facets
      Category::ARCHIVE_CATEGORIES.map{|c| c.first.to_s.singularize }.each do |category|
        self.with((category + '_ids').to_sym).any_of query[category.pluralize] unless query[category.pluralize].blank?
      end

      facet :person_name,
            :forced_labor_group_ids,
            :forced_labor_field_ids,
            :forced_labor_habitation_ids,
            :language_ids,
            :country_ids

      paginate :page => Search.valid_page_number(page), :per_page => RESULTS_PER_PAGE
      order_by :person_name, :asc

    end
  end

  # do a standard search with the lucene handler
  def standard_lucene_search(query, page=1)
    # SOLR query
    fulltext_query = Search.lucene_escape(query['fulltext'])
    Sunspot.search Interview do

      # person name facet
      unless query['person_name'].blank?
        self.with :person_name, query['person_name']
      end

      # category facets
      Category::ARCHIVE_CATEGORIES.map{|c| c.first.to_s.singularize }.each do |category|
        self.with((category + '_ids').to_sym).any_of query[category.pluralize] unless query[category.pluralize].blank?
      end

      facet :person_name,
            :forced_labor_group_ids,
            :forced_labor_field_ids,
            :forced_labor_habitation_ids,
            :language_ids,
            :country_ids

      paginate :page => Search.valid_page_number(page), :per_page => RESULTS_PER_PAGE
      order_by :person_name, :asc

      adjust_solr_params do |params|
        params[:defType] = 'lucene'
        #params[:qt] = 'standard'

        # fulltext search
        unless fulltext_query.blank?
          params[:q] = fulltext_query
        end
      end

    end
  end

  # search for autocomplete on person_name
  def person_name_search(query, page=1)
    # SOLR query
    fulltext_query = Search.lucene_escape(query['fulltext'])
    Sunspot.search Interview do

      # search for partial person names for autocompletion
      keywords 'person_name_text:' + query['partial_person_name'].downcase + '*', :fields => 'person_name'

      unless fulltext_query.blank?
        text_fields do
          any_of do
            with :transcript, fulltext_query
            with :categories, fulltext_query
          end
        end
      end

      # category facets
      Category::ARCHIVE_CATEGORIES.map{|c| c.first.to_s.singularize }.each do |category|
        self.with((category + '_ids').to_sym).any_of query[category.pluralize] unless query[category.pluralize].blank?
      end

      facet :person_name,
            :forced_labor_group_ids,
            :forced_labor_field_ids,
            :forced_labor_habitation_ids,
            :language_ids,
            :country_ids

      paginate :page => Search.valid_page_number(page), :per_page => RESULTS_PER_PAGE
      order_by :person_name, :asc

      adjust_solr_params do |params|
        params[:defType] = 'lucene'
      end

    end
  end

  # Escapes lucene query for safe querying with the Lucene Parser
  def self.lucene_escape(query)
    if query.blank?
      ''
    else
      Unicode.downcase(query.gsub("\\",'').gsub(/^[\*\?\+\-\{\}\[\]~!\(\)]+/,''))
    end
  end

  def self.valid_page_number(page)
    page.to_i > 0 ? page.to_i : 1
  end

  # transforms a parameter hashtable to a hashed string
  def self.encode_parameters(params)
    param_tokens = []
    params.stringify_keys!
    (QUERY_PARAMS - ['page']).each do |p|
      unless params[p].blank?
        param_tokens << Search.codify_parameter_name(p) + '=' + (params[p].is_a?(Array) ? params[p].inspect : params[p].to_s)
      end
    end
    Base64.encode64(param_tokens.join('|')).gsub("\n",'').sub(/=*$/,'')
  end

  def self.decode_parameters(hash)
    params_str = Base64.decode64(hash)
    params = {}
    params_str.split('|').each do |token|
      p_code = (token[/^[a-z]+=/] || '').sub('=','')
      next if p_code.blank?
      p_value = token.sub(p_code + '=', '')
      p_key = nil
      (QUERY_PARAMS - ['page']).each do |param_name|
        p_key = param_name if Search.codify_parameter_name(param_name) == p_code
      end
      # make sure arrays of ids are instantiated as such:
      numeric_values = p_value.scan(/\"\d+\"/)
      params[p_key] = numeric_values.empty? ? p_value : numeric_values.map{|v| v[/\d+/].to_i.to_s } unless p_key.nil?
    end
    params
  end

  def self.codify_parameter_name(name)
    name.split('_').map{|i|i.first.downcase}.join('')
  end

end