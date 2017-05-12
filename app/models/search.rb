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

class Search < UserContent

  require 'yaml'
  require 'base64'

  RESULTS_PER_PAGE = 12

  FACET_FIELDS = [:interview_id, :language_id] + Project.archive_facet_category_ids

  NON_FACET_FIELDS = [
      :fulltext,
      :partial_person_name,
      :page
  ]

  # This contains a list of accessible attributes that are not
  # considered query params and will not be kept in a stored search.
  NON_QUERY_ACCESSIBLES = [
      :open_category
  ]

  QUERY_PARAMS = (FACET_FIELDS + NON_FACET_FIELDS - NON_QUERY_ACCESSIBLES).map{|a| a.to_s }

  def self::param_codes(params)
    num_letters = 0
    result = { '' => params }
    unique = false

    until unique do
      unique = true

      result.select do |code, params|
               code == '' or params.size > 1
             end.
             each do |last_code, params|
               result.delete(last_code)
               params.each do |param|
                 code = param.split('_').map{|param_part| param_part[0..num_letters].downcase}.join('')
                 result[code] ||= []
                 result[code] << param
                 unique = false if result[code].size > 1
               end
             end

      num_letters += 1
    end

    result.reduce({}) do |param_codes, tuple|
      code, param_as_array = tuple
      param_codes[code] = param_as_array[0]
      param_codes
    end
  end

  PARAM_CODES = self::param_codes(QUERY_PARAMS)

  ACCESSIBLES = FACET_FIELDS + NON_QUERY_ACCESSIBLES + NON_FACET_FIELDS

  # Accessors for each query param *except* *fulltext*
  # (fulltext is actually the keywords search DB column.
  (ACCESSIBLES - ['fulltext']).each do |query_param|
    class_eval <<-DEF
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

  # Textual person name searches.
  def person_name=(person_name)
    @person_name = person_name
  end

  def person_name
    @person_name
  end

  # Used to construct the autocomplete searches for person names.
  def partial_person_name=(name_token)
    @partial_person_name = name_token
  end

  def partial_person_name
    @partial_person_name
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
  # format: <tt>[ facet_object_instance, count ]</tt>.
  def facet(name)
    @facets ||= {}
    facet_name = (if Project.is_category?(name)
                   name.to_s.singularize << '_ids'
                 else
                   name
                 end).to_sym
    @facets[facet_name] ||=
        if @search
          facet = @search.facet(facet_name)
          if facet.blank?
            []
          elsif facet.rows.blank?
            if Project.is_category?(name)
              # Yield all categories with a count of zero.
              RegistryEntry.find_all_by_category(name).sort_by(&:to_s).map{|c| [c, 0]}
            else
              []
            end
          else
            # Return an array of all instances with number of corresponding hits.
            facet.rows.
                map { |f| [f.instance, f.count] }.
                reject do |f|
                  if f.first.is_a?(Interview)
                    f.first.full_title(I18n.locale).blank?
                  elsif f.first.is_a?(RegistryEntry) or f.first.is_a?(Language)
                    f.first.to_s(I18n.locale).blank?
                  else
                    true
                  end
                end.
                sort do |a, b|
                  if a.first.is_a?(Interview)
                    Unicode::strcmp(a.first.full_title(I18n.locale), b.first.full_title(I18n.locale))
                  else
                    Unicode::strcmp(a.first.to_s(I18n.locale), b.first.to_s(I18n.locale))
                  end
                end
          end
        else
          []
        end
  end

  # Returns the query params - this is needed for link generation from a given query, for instance.
  def query_params
    QUERY_PARAMS.inject({}) do |query, query_param|
      query_value = self.send(query_param)
      query[query_param] = query_value unless query_value.nil?
      query
    end
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
      @search = self.class.unfiltered_interview_search(@page)

    else
      if current_query_params['partial_person_name'].blank?
        # fulltext/category search
        @search = self.class.filtered_interview_search current_query_params, @page

      else
        # search for partial person names for autocompletion
        @search = self.class.person_name_search current_query_params, @page

      end
    end
    @search.execute!
    @hits = @search.total
    @results = @search.results

    # facets are populated from the search lazily
    @facets = nil
    @query = current_query_params.select{|k,v| !v.nil? }
    @query_facets = nil
    @query_hash = nil
    @segments = {}
    @search
  end

  def matching_segments_for(archive_id)
    archive_id.upcase! if archive_id.is_a?(String)
    @segments.is_a?(Hash) ? (@segments[archive_id] || []) : []
  end

  # Performs a sub-search for matching segments on the facetted search
  # result set.
  def segment_search!
    @segments = {}
    fulltext = self.query_params['fulltext']
    interview_ids = @results.map{|i| i.archive_id }
    unless fulltext.blank? || interview_ids.empty?
      subsearch = Sunspot.search Segment do

        with(:archive_id).any_of interview_ids

        keywords fulltext

        paginate :page => 1, :per_page => 120

        order_by :timecode, :asc

        adjust_solr_params do |params|
          params[:defType] = 'edismax'
        end

      end

      # Iterate over results, not subsearch!
      @results.each do |interview|

        subsearch.hits.select{|h| not h.instance.blank? and h.instance.archive_id == interview.archive_id }.each do |segment_result|

          segment = segment_result.instance

           if @segments[interview.archive_id.upcase].is_a?(Array)
             @segments[interview.archive_id.upcase] << segment
           else
             @segments[interview.archive_id.upcase] = [ segment ]
           end

        end


      end

    end
  end

  def default_title(locale)
    title_tokens = [Search.human_name(:locale => locale)]
    terms = read_property(:query)['fulltext']
    title_tokens << "'#{terms}'" unless terms.blank?
    title_tokens << I18n.l(created_at.localtime, :format => :short, :locale => locale)
    title_tokens.join(' ')
  end

  # provides user_content attributes for new user_content
  # except the link_url, which is generated in the view
  def user_content_attributes
    attr = {}
    attr[:interview_references] = @results.nil? ? (read_property(:interview_references) || []) : @results[0..4].map(&:archive_id).join(',')
    attr[:properties] = { :query => @query, :hits => @hits, :query_hash => query_hash }
    attr
  end

  # re-form query hash
  def properties=(props)
    if props['query'].is_a?(Array)
      query_array = props['query'].dup
      props['query'] = query_array.inject({}){|h,v| h[v.first] = v.last; h }
    end
    super(props)
  end

  # path to show the resource
  def get_content_path
    search_by_hash_path(:suche => query_hash.blank? ? read_property('query_hash') : query_hash)
  end

  class << self

    def in_interview(id, fulltext)
      search_results = if id.is_a?(Integer)
                         Interview.where(id: id)
                       else
                         Interview.where(archive_id: id)
                       end
      Search.new do |search|
        search.results = search_results
        search.fulltext = fulltext
      end
    end

    def from_params(query_params=nil)
      # Clear the default search field contents from the query
      # on the server-side, in case this is missed by the JS client code.
      unless query_params.blank? or query_params['fulltext'].blank?
        ignored_search_terms = I18n.available_locales.map do |locale|
          I18n.t('search_term', :scope => 'user_interface.search', :locale => locale)
        end
        if ignored_search_terms.include? query_params['fulltext']
          query_params.delete('fulltext')
        end
      end

      if query_params.blank?
        if !defined?(@@default_search_cache_time) || (Time.now - @@default_search_cache_time > 1.hour)
          @@default_search = nil
          @@default_search_cache_time = Time.now
        end
        @@default_search ||= begin Search.new{|base| base.search! }; rescue; Search.new; end;
      else
        search_params = query_params['suche'].blank? ? {} : Search.decode_parameters(query_params.delete('suche'))
        search_params.merge!(query_params)

        # Translate a person name search into an interview search.
        person_name = search_params.delete('person_name')
        unless person_name.blank?
          interviews = build_unfiltered_interview_query(1) do
                         with(:"person_name_#{I18n.locale}").any_of person_name
                       end.
                       execute!.
                       results
          search_params['interview_id'] = interviews.map(&:id).map(&:to_s) unless interviews.blank?
        end

        Search.new do |search|
          QUERY_PARAMS.each do |attr|
            search.send("#{attr}=", search_params[attr.to_s]) unless search_params[attr.to_s].blank?
          end
        end
      end
    end

    # transforms a parameter hashtable to a hashed string
    def encode_parameters(params)
      param_tokens = []
      params.stringify_keys!
      (QUERY_PARAMS - ['page']).each do |p|
        unless params[p].blank?
          param_tokens << Search.codify_parameter_name(p) + '=' + (params[p].is_a?(Array) ? params[p].inspect : params[p].to_s)
        end
      end
      Base64.encode64(param_tokens.join('|')).gsub("\n", '').gsub('/', '_') # replace Base64 slashes with underscore!
    end

    def decode_parameters(hash)
      params_str = Base64.decode64(hash.gsub('_', '/'))
      params = {}
      params_str.split('|').each do |token|
        p_code = (token[/^[a-z]+=/] || '').sub('=', '')
        next if p_code.blank?
        p_value = token.sub(p_code + '=', '')
        p_key = PARAM_CODES[p_code]
        # make sure arrays of ids are instantiated as such:
        numeric_values = p_value.scan(/\"\d+\"/)
        params[p_key] = numeric_values.empty? ? p_value : numeric_values.map{|v| v[/\d+/].to_i.to_s } unless p_key.nil?
      end
      params
    end

    def codify_parameter_name(param)
      PARAM_CODES.invert[param]
    end

    # sets the query hash as id_hash instead of serialized interview references (default)
    def default_id_hash(instance)
      instance.query_hash.blank? ? instance.read_property('query_hash') || 'blank_search' : instance.query_hash
    end

    def valid_page_number(page)
      page.to_i > 0 ? page.to_i : 1
    end

    # the default blank search - nothing but facets
    def unfiltered_interview_search(page = 1)
      build_unfiltered_interview_query(page)
    end

    # Do a filtered interview search.
    def filtered_interview_search(query, page = 1)
      build_filtered_interview_query(query, page) do

        # Person/Interview facet.
        unless query['interview_id'].blank?
          with :interview_id, query['interview_id']
        end

      end
    end

    # Search for autocomplete on person_name.
    def person_name_search(query, page=1)
      build_filtered_interview_query(query, page) do
        # Search for partial person names for autocompletion.
        # NB: We cannot use ... with :person_name ... here as
        # wildcards ('*') in restrictions will be escaped in
        # sunspot although the edismax parser supports them.
        adjust_solr_params do |params|
          params[:fq] << "person_name_text:#{query['partial_person_name']}*"
        end
      end
    end

    private

    # Build a basic solr query filtered on categories.
    def build_filtered_interview_query(query, page, &attributes)

      search = build_unfiltered_interview_query(page) do

        # Fulltext search.
        fulltext_query = query['fulltext']
        unless fulltext_query.blank?
          keywords fulltext_query
        end

        # Language.
        unless query['language_id'].blank?
          with :language_id, query['language_id']
        end

        # Configured category facets.
        Project.archive_facet_category_ids.map(&:to_s).each do |category_name|
          with(("#{category_name.singularize}_ids").to_sym).any_of query[category_name] unless query[category_name].blank?
        end

      end

      search.build(&attributes)

    end

    # Build a basic query with attributes common
    # to all interview queries.
    def build_unfiltered_interview_query(page, &attributes)
      search = Sunspot.new_search(Interview)

      # Build the query.
      # search.build(&attributes) if block_given?
      #
      # # Add query attributes common to all interview queries.
      # search.build do
      #
      #   id_fields = [:interview_id, :language_id] + Project.archive_facet_category_ids.map{|c| "#{c.to_s.singularize}_ids"}
      #
      #   facet #*id_fields
      #
      #   paginate :page => Search.valid_page_number(page), :per_page => RESULTS_PER_PAGE
      #   order_by :"person_name_#{I18n.locale}", :asc
      #
      #   adjust_solr_params do |params|
      #     # Use the edismax parser for wildcard support and
      #     # more feature-rich query syntax.
      #     params[:defType] = 'edismax'
      #   end
      #
      # end
    end

  end

end
