require 'globalize'
class Project < ApplicationRecord

  has_many :interviews 
  has_many :collections 
  has_many :metadata_fields 
  has_many :external_links 
  has_many :registry_entry_projects
  has_many :registry_entries,
    through: :registry_entry_projects
  has_many :user_registration_projects
  has_many :user_registrations,
    through: :user_registration_projects

  translates :name 
  accepts_nested_attributes_for :translations

  serialize :view_modes, Array
  serialize :available_locales
  serialize :upload_types
  serialize :name
  serialize :hidden_registry_entry_ids
  serialize :pdf_registry_entry_codes

  class << self
    def config
      @config ||= Rails.configuration.project
    end

    def method_missing(n, *args, &block)
      if config.has_key? n.to_s
        config[n.to_s]
      else
        #raise "#{self} does NOT have a key named #{n}"
        nil
      end
    end

    # TODO: fit this method 
    def current
      first
    end
  end

  def identifier
    shortname.downcase
  end

  def cache_key_prefix
    shortname.downcase
  end

  # there is a rails method available_locales as well.
  # we need to overwrite it here.
  #
  def available_locales
    read_attribute :available_locales
  end

  def search_facets
    metadata_fields.where(use_as_facet: true)
  end

  def search_facets_names
    metadata_fields.where(use_as_facet: true).map(&:name)
  end

  def list_columns
    metadata_fields.where(use_in_results_table: true)
  end

  def detail_view_fields
    metadata_fields.where(use_in_details_view: true)
  end

  %w(registry_entry registry_reference_type person interview).each do |m|
    define_method "#{m}_search_facets" do
      metadata_fields.where(use_as_facet: true, source: m)
      # TODO: classify source
      #metadata_fields.where(use_as_facet: true, source: m.classify)
    end
    #
    # used for metadata that is not used as facet
    define_method "#{m}_metadata_fields" do
      metadata_fields.where(source: m)
      # TODO: classify source
      #metadata_fields.where(source: m.classify)
    end
  end

  def min_to_max_birth_year_range
    Rails.cache.fetch("#{cache_key_prefix}-min_to_max_birth_year") do
      first = (interviews.map { |i| i.interviewees.first.try(:year_of_birth).try(:to_i) } - [nil, 0]).sort.first || 1900
      last = (interviews.map { |i| i.interviewees.first.try(:year_of_birth).try(:to_i) } - [nil, 0]).sort.last || DateTime.now.year
      (first..last)
    end
  end

  def search_facets_hash
    # TODO: there is potential to make the following (uncached) faster
    #
    Rails.cache.fetch("#{cache_key_prefix}-#{updated_at}-search-facets-hash") do
      search_facets.inject({}) do |mem, facet|
        case facet["source"]
        when "registry_entry",  "registry_reference_type"
          mem[facet.name.to_sym] = ::FacetSerializer.new(facet.source.classify.constantize.find_by_code(facet.name)).as_json
        when "person", "interview"
          facet_label_hash = facet.localized_hash
          name = facet_label_hash || localized_hash_for("search_facets", facet.name)
          if facet.name == "year_of_birth"
            mem[facet.name.to_sym] = {
              name: name,
              subfacets: min_to_max_birth_year_range.inject({}) do |subfacets, key|
                h = {}
                I18n.available_locales.map { |l| h[l] = key }
                subfacets[key.to_s] = {
                  name: h,
                  count: 0,
                }
                subfacets
              end,
            }
          elsif facet.name == "typology"
            mem[facet.name.to_sym] = {
              name: name,
              subfacets: %w( collaboration concentration_camp flight occupation persecution_of_jews resistance retaliation ).inject({}) do |subfacets, key|
              #subfacets: [ "Collaboration", "Concentration camp", "Flight", "Occupation", "Persecution of Jews", "Resistance", "Retaliation" ].inject({}) do |subfacets, key|
                subfacets[key.to_s] = {
                  name: localized_hash_for("search_facets", key),
                  count: 0,
                }
                subfacets
              end,
            }
          else 
            mem[facet.name.to_sym] = {
              name: name,
              subfacets: facet.source.classify.constantize.group(facet.name).count.keys.compact.inject({}) do |subfacets, key|
                subfacets[key.to_s] = {
                  name: localized_hash_for("search_facets", key),
                  count: 0,
                }
                subfacets
              end,
            }
          end
        when "collection", "language"
          facet_label_hash = facet.localized_hash
          mem[facet.name.to_sym] = {
            name: facet_label_hash || localized_hash_for("search_facets", facet.name),
            subfacets: facet.source.classify.constantize.all.inject({}) do |subfacets, sf|
              subfacets[sf.id.to_s] = {
                name: sf.localized_hash,
                count: 0,
              }
              subfacets
            end,
          }
        end
        mem.with_indifferent_access
      end
    end
  end

  def localized_hash_for(specifier, key = nil)
    I18n.available_locales.inject({}) do |desc, locale|
      desc[locale] = I18n.t([specifier, key].compact.join("."), locale: locale)
      desc
    end
  end

  def updated_search_facets(search)
    facets = search_facets_hash.deep_dup
    search_facets_names.each do |facet|
      search.facet("search_facets:#{facet}").rows.each do |row|
        facets[facet][:subfacets][row.value][:count] = row.count if facets[facet][:subfacets][row.value]
      end
    end
    facets
  end

end
