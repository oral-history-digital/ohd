class Search < ActiveRecord::Base

  require 'yaml'

  RESULTS_PER_PAGE = 12

  def self.from_params(query_params=nil)
    Search.new
  end

  attr_accessible :fulltext,
                  :person_name,
                  :forced_labor_groups,
                  :forced_labor_fields,
                  :forced_labor_habitations,
                  :languages,
                  :countries,
                  :page

  # accessors for each query param *except fulltext*
  # (fulltext is actually the keywords search DB column
  (self.accessible_attributes - [ 'fulltext' ]).each do |query_param|
    class_eval <<DEF
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

  def results
    @results ||= read_attribute :results
    @results = YAML.load(@results) if @results.is_a?(String)
  end

  def hits
    @hits ||= 0
  end

  def query
    @query
  end

  # query Solr for matching interviews
  def search!
    query_params = {}
    Search.accessible_attributes.each do |query_param|
      query_params[query_param] = self.send(query_param)
    end
    search = Sunspot.search Interview do
      unless query_params['fulltext'].blank?
        self.adjust_solr_params do |params|
          params[:q] += ' ' + query_params['fulltext']
        end
      end
      Category::ARCHIVE_CATEGORIES.map{|c| c.first.to_s.singularize }.each do |category|
        self.with((category + '_ids').to_sym).any_of query_params[category.pluralize] unless query_params[category.pluralize].blank?
      end
      self.with(:language_id).any_of query_params['languages'] unless query_params['languages'].blank?
      # with(:country_id).any_of query_params[:countries] unless query_params[:countries].blank?
      self.with :full_title, query_params['person_name'] unless query_params['person_name'].blank?
      paginate :page => query_params['page'] || 1, :per_page => RESULTS_PER_PAGE
      # order_by :full_title, :asc
#      facet :person_name,
#            :forced_labor_group_ids,
#            :forced_labor_field_ids,
#            :forced_labor_habitation_ids,
#            :language_id,
#            :country_id
    end
    @hits = search.total
    @query = search.query.to_params
    @results = search.results
    puts "\n@@@@@\nSEARCH! -> #{@hits} hits found\nquery_params = #{query_params.inspect}\nQUERY: #{@query.inspect}\n\nRESULTS:\n#{@results.map{|r| r.class.name + ': ' + r[:id].to_s }.join(', ')}\n@@@@@\n\n"
  end

  

end