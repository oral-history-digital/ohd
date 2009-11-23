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

  attr_accessible :fulltext,
                  :person_name,
                  :forced_labor_groups,
                  :forced_labor_fields,
                  :forced_labor_habitations,
                  :languages,
                  :countries,
                  :page

  # Accessors for each query param *except* *fulltext*
  # (fulltext is actually the keywords search DB column.
  (self.accessible_attributes - [ 'fulltext' ]).each do |query_param|
    class_eval <<DEF
    # This is the generated setter for accessing the
    # #{query_param} query conditions.
    def #{query_param}=(#{query_param}_query)
      @#{query_param}=#{query_param}_query
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

  # The facet method returns an array of facet rows in the
  # format: <tt>[ category_instance, count ]</tt>.
  def facet(name)
    @facets ||= {}
    @facets[name.to_sym] ||= \
    if @search.is_a?(Sunspot::Search)
      facet = @search.facet(name.to_sym)
      if facet.blank? || facet.rows.blank?
        []
      else
        facet.rows.map{|f| [ f.instance, f.count ] }.sort{|a,b| a.first.name <=> b.first.name }
      end
    else
      []
    end
  end

  # query Solr for matching interviews
  def search!
    query_params = {}
    Search.accessible_attributes.each do |query_param|
      query_params[query_param] = self.send(query_param)
    end
    @search = Sunspot.search Interview do
      keywords query_params['fulltext']
      Category::ARCHIVE_CATEGORIES.map{|c| c.first.to_s.singularize }.each do |category|
        self.with((category + '_ids').to_sym).any_of query_params[category.pluralize] unless query_params[category.pluralize].blank?
      end
      self.with(:language_id).any_of query_params['languages'] unless query_params['languages'].blank?
      # with(:country_id).any_of query_params[:countries] unless query_params[:countries].blank?
      self.with :full_title, query_params['person_name'] unless query_params['person_name'].blank?
      paginate :page => query_params['page'] || 1, :per_page => RESULTS_PER_PAGE
      order_by :person_name, :asc
      facet :person_name,
            :forced_labor_group_ids,
            :forced_labor_field_ids,
            :forced_labor_habitation_ids,
            :language_id
#            :country_id
      adjust_solr_params do |params|
        params.delete(:defType)
      end
    end
    @hits = @search.total
    @query = query_params.select{|k,v| !v.nil? }
    @results = @search.results
    puts "\n@@@@@\nSEARCH! -> #{@hits} hits found\nquery_params = #{query_params.inspect}\nQUERY: #{@query.inspect}\n\nRESULTS:\n#{@results.inspect}\n@@@@@\n\n"
    @search
  end

  def self.from_params(query_params=nil)
    if query_params.blank?
      @@default_search ||= begin Search.new{|base| base.search! }; rescue Exception; Search.new; end;
    else
      Search.new do |search|
        Search.accessible_attributes.each do |attr|
          puts "Assigning #{attr}: #{(query_params[attr.to_s] || {}).inspect} blank? => #{query_params[attr.to_s].blank?}"
          search.send(attr+'=', query_params[attr.to_s]) unless query_params[attr.to_s].blank?
        end
      end
    end
  end

end