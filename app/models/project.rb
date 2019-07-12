class Project < ApplicationRecord

  has_many :search_facets 
  has_many :external_links 
  has_many :registry_entry_projects
  has_many :registry_entries,
    through: :registry_entry_projects
  has_many :user_registration_projects
  has_many :user_registrations,
    through: :user_registration_projects

  class << self

    def config
      @config ||= Rails.configuration.project
    end

    def method_missing(n)
      if config.has_key? n.to_s
        config[n.to_s]
      else
        #raise "#{self} does NOT have a key named #{n}"
        nil
      end
    end

  end

  def cache_key_prefix
    @config["cache_key_prefix"] ||= project_id
  end

  def name
    shortname.downcase
  end

  def keys
    project_config.keys
  end

  # TODO: fit this method 
  def actual
    first
  end

  %w(registry_entry registry_reference_type person interview).each do |m|
    define_method "#{m}_search_facets" do
      search_facets.where(use_as_facet: true, facet_type: m.classify)
    end
  end

  # used for metadata that is not used as facet
  %w(registry_entry registry_reference_type person interview).each do |m|
    define_method "person_properties_#{m}" do
      search_facets.where(facet_type: m.classify)
    end
  end

  def search_facets_names
    person_properties.select { |c| c["use_as_facet"] }.map { |c| c["id"] }
  end

  def min_to_max_birth_year_range
    Rails.cache.fetch("#{Project.cache_key_prefix}-min_to_max_birth_year") do
      first = (Interview.all.map { |i| i.interviewees.first.try(:year_of_birth).try(:to_i) } - [nil, 0]).sort.first || 1900
      last = (Interview.all.map { |i| i.interviewees.first.try(:year_of_birth).try(:to_i) } - [nil, 0]).sort.last || DateTime.now.year
      (first..last)
    end
  end

  def search_facets_hash
    @search_facets_hash ||= search_facets.inject({}) do |mem, facet|
      case facet["source"]
      when "registry_entry"
        mem[facet["id"].to_sym] = ::FacetSerializer.new(RegistryEntry.find_by_entry_code(facet["id"])).as_json
      when "registry_reference_type"
        mem[facet["id"].to_sym] = ::FacetSerializer.new(RegistryReferenceType.find_by_code(facet["id"])).as_json
      when "person"
        if facet["id"] == "year_of_birth"
          facet_label_hash = Project.person_properties.select { |c| c["id"] == facet["id"] }[0]["facet_label"]
          mem[facet["id"].to_sym] = {
            name: facet_label_hash || localized_hash_for("search_facets", facet["id"]),
            subfacets: min_to_max_birth_year_range.inject({}) do |subfacets, key|
              h = {}
              I18n.available_locales.map { |l| h[l] = key }
              subfacets[key] = {
                name: h,
                count: 0,
              }
              subfacets
            end,
          }
        else #gender
          facet_label_hash = Project.person_properties.select { |c| c["id"] == facet["id"] }[0]["facet_label"]
          mem[facet["id"].to_sym] = {
            name: facet_label_hash || localized_hash_for("search_facets", facet["id"]),
            subfacets: facet["values"].inject({}) do |subfacets, (key, value)|
              subfacets[value] = {
                name: localized_hash_for("search_facets", key),
                count: 0,
              }
              subfacets
            end,
          }
        end
      when "interview"
        facet_label_hash = Project.person_properties.select { |c| c["id"] == facet["id"] }[0]["facet_label"]
        mem[facet["id"].to_sym] = {
          name: facet_label_hash || localized_hash_for("search_facets", facet["id"]),
          subfacets: Interview.all.inject({}) do |subfacets, interview|
            subfacets[interview.send(facet["id"]).to_s] = {
              name: interview.send("localized_hash_for_" + facet["id"]),
              count: 0,
            }
            subfacets
          end,
        }
      when "collection"
        facet_label_hash = Project.person_properties.select { |c| c["id"] == facet["id"] }[0]["facet_label"]
        mem[facet["id"].to_sym] = {
          name: facet_label_hash || localized_hash_for("search_facets", facet["id"]),
          subfacets: Interview.all.inject({}) do |subfacets, interview|
            subfacets[interview.send(facet["id"])] = {
              name: interview.collection ? interview.collection.localized_hash : { en: "no collection" },
              count: 0,
            }
            subfacets
          end,
        }
      when "language"
        mem[facet["id"].to_sym] = {
          name: localized_hash_for("search_facets", facet["id"]),
          subfacets: Interview.all.inject({}) do |subfacets, interview|
            subfacets[interview.send(facet["id"])] = {
              name: interview.language ? interview.language.localized_hash : { en: "no language" },
              count: 0,
            }
            subfacets
          end,
        }
      end
      mem.with_indifferent_access
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
      search.facet(facet).rows.each do |row|
        facets[facet][:subfacets][row.value][:count] = row.count if facets[facet][:subfacets][row.value]
      end
    end
    facets
  end

end
