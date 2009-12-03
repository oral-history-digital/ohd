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

class Search < ActiveRecord::Base

  require 'yaml'

  RESULTS_PER_PAGE = 12

  FACET_FIELDS = [
                      :person_name,
                      :forced_labor_groups,
                      :forced_labor_fields,
                      :forced_labor_habitations,
                      :languages,
                      :countries
  ]

  class_eval <<ATTR
    attr_accessible :#{(FACET_FIELDS \
                            + [
                                :fulltext,
                                :page
                              ]).join(', :')}
ATTR

  # Accessors for each query param *except* *fulltext*
  # (fulltext is actually the keywords search DB column.
  (self.accessible_attributes - [ 'fulltext' ]).each do |query_param|
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
    write_attribute :results, @results.to_yaml
  end

  # Returns the Sunspot::Search#results of any queries
  # performed via Search#search!.
  def results
    @results ||= read_attribute :results
    @results = YAML.load(@results) if @results.is_a?(String)
    @results
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
      puts "FACET NAME: #{facet_name}  => #{facet}"
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
    query_params = {}
    Search.accessible_attributes.each do |query_param|
      query_value = self.send(query_param)
      query_params[query_param] = query_value unless query_value.nil?
    end
    query_params
  end

  # query Solr for matching interviews
  def search!
    query_params = self.query_params
    @search = Sunspot.search Interview do

      # fulltext search
      keywords query_params['fulltext'].downcase unless query_params['fulltext'].blank?

      # category facets
      Category::ARCHIVE_CATEGORIES.map{|c| c.first.to_s.singularize }.each do |category|
        self.with((category + '_ids').to_sym).any_of query_params[category.pluralize] unless query_params[category.pluralize].blank?
      end

      # person name facet
      self.with :person_name, query_params['person_name'] unless query_params['person_name'].blank?
      
      facet :person_name,
            :forced_labor_group_ids,
            :forced_labor_field_ids,
            :forced_labor_habitation_ids,
            :language_ids,
            :country_ids

      paginate :page => query_params['page'] || 1, :per_page => RESULTS_PER_PAGE
      order_by :person_name, :asc

      adjust_solr_params do |params|
        params.delete(:defType)
      end
    end
    @hits = @search.total
    @query = query_params.select{|k,v| !v.nil? }
    @query_facets = nil
    @facets = nil
    @results = @search.results
    puts "\n@@@@@\nSEARCH! -> #{@hits} hits found\nquery_params = #{query_params.inspect}\nQUERY: #{@query.inspect}\n\nRESULTS:\n#{@results.inspect}\n@@@@@\n\n"
    @search
  end

  def search_for_keyword(word)
    Sunspot.search Interview do

      keywords word.downcase

      adjust_solr_params do |p|
        p.delete(:defType)
      end

    end
  end


  def segment_search!
    fulltext = self.query_params['fulltext']

    interview_ids = @results.map{|i| i.archive_id }
    unless fulltext.blank? || interview_ids.empty?
      subsearch = Sunspot.search Segment do

        # keyword search on fulltext only
        keywords fulltext.downcase do
          highlight :transcript, :translation
        end

        with(:archive_id).any_of interview_ids

        adjust_solr_params do |params|
          params.delete(:defType)
        end
      end

      puts "\nSEGMENT SUBSEARCH: found #{subsearch.total} segments."

      puts "SEGMENTS: #{subsearch.results.inspect}"

      subsearch.hits.each do |segment_result|
        segment = segment_result.instance
        puts "Highlights for segment: #{segment.media_id} = #{segment_result.highlights('translation').inspect}"
        interview = @results.select{|i| i.archive_id == segment.archive_id }.first
        unless interview.nil?
          interview.matching_segments
          interview.add_matching_segment(segment)
        end
      end

    end
  end

  def self.from_params(query_params=nil)
    if query_params.blank?
      @@default_search ||= begin Search.new{|base| base.search! }; rescue Exception; Search.new; end;
    else
      Search.new do |search|
        Search.accessible_attributes.each do |attr|
          search.send(attr+'=', query_params[attr.to_s]) unless query_params[attr.to_s].blank?
        end
      end
    end
  end

end