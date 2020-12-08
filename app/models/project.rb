require "globalize"

class Project < ApplicationRecord

  has_many :logos, as: :ref
  has_many :sponsor_logos, as: :ref

  has_many :interviews
  has_many :collections
  has_many :metadata_fields
  has_many :task_types
  has_many :external_links
  has_many :registry_entry_projects
  has_many :registry_entries,
    through: :registry_entry_projects
  has_many :user_registration_projects
  has_many :user_registrations,
    through: :user_registration_projects

  translates :name, :introduction, :more_text, :landing_page_text, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  serialize :view_modes, Array
  serialize :available_locales, Array
  serialize :upload_types, Array
  #serialize :name, Array
  serialize :funder_names, Array
  serialize :hidden_registry_entry_ids, Array
  serialize :pdf_registry_entry_codes, Array
  # serialize :fullname_on_landing_page

  #
  # define pseudo-methods for serialized attributes
  # 
  # if params[:available_locales] = "de,en,ru" (a string!!) it can not be serialized
  # therefore the string-values from the params-hash are splitted  first
  # 
  [:view_modes, :available_locales, :upload_types, :funder_names, :hidden_registry_entry_ids, :pdf_registry_entry_codes].each do |m|
    define_method "pseudo_#{m}=" do |string|
      write_attribute(m, string.split(','))
    end
    define_method "pseudo_#{m}" do
      read_attribute m
    end
  end

  validates :aspect_x, numericality: { only_integer: true }
  validates :aspect_y, numericality: { only_integer: true }
  validates :archive_id_number_length, numericality: { only_integer: true }
  validates :initials, format: { with: /\A[a-zA-Z]+\z/ }

  before_save :touch_interviews
  def touch_interviews
    interviews.each(&:touch) if landing_page_text_changed?
  end

  after_create :create_root_registry_entry
  def create_root_registry_entry
    root = RegistryEntry.create(code: 'root', workflow_state: 'public')
    RegistryEntryProject.create(project_id: self.id, registry_entry_id: root.id)
  end

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

  # there is a rails method available_locales as well.
  # we need to overwrite it here.
  #
  def available_locales
    read_attribute :available_locales
  end

  def archive_domain
    Rails.env == "development" ? "http://localhost:3000" : read_attribute(:archive_domain)
  end

  def root_registry_entry
    registry_entries.where(code: 'root').first
  end

  def search_facets
    metadata_fields.where(use_as_facet: true).
      includes(:translations, :registry_reference_type, registry_entry: {registry_names: :translations}).
      order(:facet_order)
  end

  def search_facets_names
    metadata_fields.where(use_as_facet: true).map(&:name)
  end

  def grid_fields
    metadata_fields.where(use_in_results_table: true).order(:list_columns_order)
  end

  def list_columns
    metadata_fields.where(use_in_results_list: true).order(:list_columns_order)
  end

  def clear_cache(namespace)
    Rails.cache.redis.keys("#{cache_key_prefix}-#{namespace}*").each{|k| Rails.cache.delete(k)}
  end

  #%w(RegistryEntry RegistryReferenceType Person Interview).each do |m|
  %w(RegistryReferenceType Person Interview).each do |m|
    define_method "#{m.underscore}_search_facets" do
      metadata_fields.where(use_as_facet: true, source: m)
    end
    #
    # used for metadata that is not used as facet
    define_method "#{m.underscore}_metadata_fields" do
      metadata_fields.where(source: m)
    end
  end

  def min_to_max_birth_year_range
    Rails.cache.fetch("#{cache_key_prefix}-min_to_max_birth_year") do
      first = (interviews.map { |i| i.interviewee.try(:year_of_birth).try(:to_i) } - [nil, 0]).sort.first || 1900
      last = (interviews.map { |i| i.interviewee.try(:year_of_birth).try(:to_i) } - [nil, 0]).sort.last || DateTime.now.year
      (first..last)
    end
  end

  def search_facets_hash
    # TODO: there is potential to make the following (uncached) faster
    #
    search_facets.inject({}) do |mem, facet|
      case facet["source"]
      when "RegistryReferenceType"
        rr = facet.registry_reference_type
        if rr
          mem[facet.name.to_sym] = Rails.cache.fetch("#{cache_key_prefix}-facet-#{facet.name}-#{rr.id}-#{rr.updated_at}-#{facet.updated_at}-registry_reference_type-search-facets") do
            ::FacetSerializer.new(rr).as_json
          end
        end
      when "Person", "Interview"
        facet_label_hash = facet.localized_hash(:label)
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
        #
        # typology is a RegistryReferenceType now
        #
        #elsif facet.name == "typology"
          #mem[facet.name.to_sym] = {
            #name: name,
            #subfacets: %w( collaboration concentration_camp flight occupation persecution_of_jews resistance retaliation ).inject({}) do |subfacets, key|
              ##subfacets: [ "Collaboration", "Concentration camp", "Flight", "Occupation", "Persecution of Jews", "Resistance", "Retaliation" ].inject({}) do |subfacets, key|
              #subfacets[key.to_s] = {
                #name: localized_hash_for("search_facets", key),
                #count: 0,
              #}
              #subfacets
            #end,
          #}
        elsif %w(tasks_user_account_ids tasks_supervisor_ids).include?(facet.name)
          # add filters for tasks
          mem[facet.name.to_sym] = {
            name: name,
            subfacets: (UserAccount.joins(:user_roles) | UserAccount.where(admin: true)).inject({}) do |subfacets, user_account|
              subfacets[user_account.id.to_s] = {
                name: I18n.available_locales.inject({}) {|desc, locale| desc[locale] = user_account.full_name; desc},
                count: 0,
              }
              subfacets
            end
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
            end
          }
        end
      when "Language"
        facet_label_hash = facet.localized_hash(:label)
        mem[facet.name.to_sym] = Rails.cache.fetch("#{cache_key_prefix}-facet-language-search-facets-#{Language.maximum(:updated_at)}-#{facet.updated_at}") do
          {
            name: facet_label_hash || localized_hash_for("search_facets", facet.name),
            subfacets: facet.source.classify.constantize.all.includes(:translations).inject({}) do |subfacets, sf|
              subfacets[sf.id.to_s] = {
                name: sf.localized_hash(:name),
                count: 0
              }
              subfacets
            end
          }
        end
      when "Collection"
        facet_label_hash = facet.localized_hash(:label)
        mem[facet.name.to_sym] = Rails.cache.fetch("#{cache_key_prefix}-facet-collection-search-facets-#{Collection.maximum(:updated_at)}-#{facet.updated_at}") do
          {
            name: facet_label_hash || localized_hash_for("search_facets", facet.name),
            subfacets: facet.source.classify.constantize.all.includes(:translations).inject({}) do |subfacets, sf|
              subfacets[sf.id.to_s] = {
                name: sf.localized_hash(:name),
                count: 0,
                homepage: sf.try(:localized_hash, :homepage),
                institution: sf.try(:localized_hash, :institution),
                notes: sf.try(:localized_hash, :notes),
              }
              subfacets
            end
          }
        end
      end
      mem.with_indifferent_access
    end
  end

  def localized_hash_for(specifier, key = nil)
    key == "" && key = "nil"
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
      rescue StandardError => e
        p "*** facet: #{facet}, row.value: #{row.value}"
        p "*** error: #{e.message}"
      end
    end
    facets
  end

end
