require "globalize"

class Project < ApplicationRecord
  include Oai
  include OaiDc
  include OaiDatacite

  enum default_search_order: [:title, :random]

  has_many :logos, as: :ref, dependent: :destroy
  has_many :sponsor_logos, as: :ref, dependent: :destroy

  has_many :institution_projects, dependent: :destroy
  has_many :institutions,
    ->{ includes(:translations) },
    through: :institution_projects
  has_many :interviews, dependent: :destroy
  has_many :collections,
    #->{ includes(:translations) },
    dependent: :destroy
  has_many :contribution_types,
    ->{ includes(:translations) },
    dependent: :destroy
  has_many :media_streams, dependent: :destroy
  has_many :metadata_fields,
    ->{ includes(:translations, registry_reference_type: {registry_entry: {registry_names: :translations}}) },
    dependent: :destroy
  has_many :task_types,
    ->{ includes(:translations) },
    dependent: :destroy
  has_many :roles, dependent: :destroy
  has_many :external_links, dependent: :destroy
  has_many :registry_entries, dependent: :destroy
  has_many :user_projects, dependent: :destroy
  has_many :users,
    through: :user_projects

  has_many :registry_reference_types, dependent: :destroy
  has_many :registry_name_types, dependent: :destroy
  has_many :people,
    ->{ includes(
      :translations,
      contributions: {contribution_type: :translations},
    ) },
    dependent: :destroy
  has_many :map_sections, dependent: :destroy
  has_many :archiving_batches, dependent: :destroy
  has_many :event_types, dependent: :destroy

  has_one :access_config, dependent: :destroy
  has_many :texts, dependent: :destroy

  translates :name, :display_name, :introduction, :more_text, :landing_page_text,
    :media_missing_text, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  serialize :view_modes, Array
  serialize :available_locales, Array
  serialize :upload_types, Array
  #serialize :name, Array
  serialize :funder_names, Array
  serialize :logged_out_visible_registry_entry_ids, Array
  serialize :hidden_registry_entry_ids, Array
  serialize :hidden_transcript_registry_entry_ids, Array
  serialize :pdf_registry_entry_ids, Array
  # serialize :fullname_on_landing_page

  after_create do
    create_access_config!
  end

  #
  # define pseudo-methods for serialized attributes
  #
  # if params[:available_locales] = "de,en,ru" (a string!!) it can not be serialized
  # therefore the string-values from the params-hash are splitted  first
  #
  [:view_modes,
    :available_locales,
    :upload_types,
    :funder_names,
    :logged_out_visible_registry_entry_ids,
    :hidden_registry_entry_ids,
    :pdf_registry_entry_ids,
    :hidden_transcript_registry_entry_ids
  ].each do |m|
    define_method "pseudo_#{m}=" do |string|
      write_attribute(m, string.strip.split(/,\s*/))
    end
    define_method "pseudo_#{m}" do
      read_attribute m
    end
  end

  validates :aspect_x, numericality: { only_integer: true },  allow_nil: true
  validates :aspect_y, numericality: { only_integer: true },  allow_nil: true
  validates :archive_id_number_length, numericality: { only_integer: true },  allow_nil: true
  validates :shortname, format: { with: /\A[\-a-z0-9]{1,11}[a-z]\z/ },  uniqueness: true,  presence: true
  validates :workflow_state, inclusion: { in: %w(public unshared),
    message: "%{value} is not a valid workflow state" }
  validates :upload_types, inclusion: { in: %w(bulk_metadata bulk_photos bulk_registry_entries bulk_texts),
    message: "%{value} is not a valid upload type" }

  scope :shared, -> { where(workflow_state: 'public' )}

  before_save :touch_interviews
  def touch_interviews
    interviews.each(&:touch) if landing_page_text_changed?
  end

  class Translation
    belongs_to :project

    after_save do
      project.interviews.update_all(updated_at: DateTime.now) if landing_page_text_previously_changed?
    end
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

    def ohd
      where(shortname: 'ohd').first
    end

    def archive_domains
      where.not(shortname: 'ohd').
        where.not(archive_domain: ['', nil]).
        pluck(:archive_domain).uniq
    end

    def by_domain(domain)
      where(archive_domain: domain).first
    end

    def by_identifier(identifier)
      where(shortname: identifier).first
    end

    def non_public_method_names
      %w(contact_email)
    end
  end

  def identifier
    shortname.downcase
  end

  def is_ohd?
    identifier == 'ohd'
  end

  def num_interviews
    interviews_count
  end

  def update_interviews_count
    self.update interviews_count: self.interviews.shared.count
  end

  def domain_with_optional_identifier
    archive_domain.blank? ? "#{OHD_DOMAIN}/#{identifier}" : archive_domain
  end

  # there is a rails method available_locales as well.
  # we need to overwrite it here.
  #
  def available_locales
    read_attribute :available_locales
  end

  def logo
    logos.where(locale: I18n.locale).first || logos.first
  end

  def root_registry_entry
    registry_entries.where(code: 'root').first
  end

  def search_facets
    metadata_fields.
      where(source: ['RegistryReferenceType', 'Interview', 'Person'], use_as_facet: true).
      includes(:translations, registry_reference_type: {registry_entry: {registry_names: :translations}}).
      order(:facet_order)
  end

  def search_facets_names
    metadata_fields.
      where(source: ['RegistryReferenceType', 'Interview', 'Person'], use_as_facet: true).
      order(:facet_order).
      pluck(:name)
  end

  def event_facets
    metadata_fields.
      includes(:translations, registry_reference_type: {registry_entry: {registry_names: :translations}}).
      where(source: 'EventType', use_as_facet: true).
      order(:facet_order)
  end

  def event_facet_names
    metadata_fields.
      includes(:translations, registry_reference_type: {registry_entry: {registry_names: :translations}}).
      where(source: 'EventType', use_as_facet: true).
      map(&:name).
      map(&:to_sym)
  end

  def grid_fields
    metadata_fields.
      includes(:translations, registry_reference_type: {registry_entry: {registry_names: :translations}}).
      where(use_in_results_table: true).order(:list_columns_order)
  end

  def list_columns
    metadata_fields.
      includes(:translations, registry_reference_type: {registry_entry: {registry_names: :translations}}).
      where(use_in_results_list: true).order(:list_columns_order)
  end

  def public_description?
    description_metadata_field&.use_in_results_list || description_metadata_field&.use_in_results_table
  end

  def description_metadata_field
    metadata_fields.
      includes(:translations).
      where(name: 'description').first
  end

  def search_results_metadata_fields
    metadata_fields.where(use_in_results_list: true).
      includes(:translations, registry_reference_type: {registry_entry: {registry_names: :translations}}).
      or(metadata_fields.where(use_in_results_table: true)).
      where.not(ref_object_type: [nil, ''])
  end

  # runs only with memcache
  #def clear_cache(namespace)
    #Rails.cache.delete_matched /^#{shortname}-#{namespace}*/
  #end

  #%w(RegistryEntry RegistryReferenceType Person Interview).each do |m|
  %w(RegistryReferenceType Person Interview).each do |m|
    define_method "#{m.underscore}_search_facets" do
      metadata_fields.
        includes(:translations, registry_reference_type: {registry_entry: {registry_names: :translations}}).
        where(use_as_facet: true, source: m)
    end
    #
    # used for metadata that is not used as facet
    define_method "#{m.underscore}_metadata_fields" do
      metadata_fields.
        includes(:translations, registry_reference_type: {registry_entry: {registry_names: :translations}}).
        where(source: m)
    end
  end

  def registry_reference_type_import_metadata_fields
    metadata_fields.
      includes(:translations, registry_reference_type: {registry_entry: {registry_names: :translations}}).
      left_joins(:registry_reference_type).where.not(registry_reference_type: {id: nil}).
      where(use_in_metadata_import: true, source: 'RegistryReferenceType')
  end

  def min_to_max_birth_year_range
    cache_key_date = [people.maximum(:updated_at), DateTime.now].compact.max.strftime("%d.%m-%H:%M")
    Rails.cache.fetch("#{shortname}-#{cache_key_date}-#{people.count}") do
      first = (interviews.map { |i| i.interviewee.try(:year_of_birth).try(:to_i) } - [nil, 0]).min || 1900
      last = (interviews.map { |i| i.interviewee.try(:year_of_birth).try(:to_i) } - [nil, 0]).max || DateTime.now.year
      (first..last)
    end
  end

  def featured_interviews
    interviews
      .where(workflow_state: 'public')
      .where.not(startpage_position: nil)
      .order(startpage_position: :asc)
  end

  def root_institutions
    institutions.map{|i| i.root }.uniq
  end

  def root_institutions_names(locale = I18n.locale)
    root_institutions.map{|i| i.name(locale) }.join(", ")
  end

  def institutions_with_ancestors
    institutions.map do |institution|
      institution.with_ancestors
    end.flatten.uniq
  end

  def institutions_with_ancestors_names(locale = I18n.locale)
    institutions_with_ancestors.map do |i|
      i.name(locale)
    end.join(", ")
  end

  def search_facets_hash
    # TODO: there is potential to make the following (uncached) faster
    #
    search_facets.inject({}) do |mem, facet|
      case facet["source"]
      when "RegistryReferenceType"
        rr = facet.registry_reference_type
        if rr
          cache_key_date = [rr.updated_at, facet.updated_at, RegistryEntry.maximum(:updated_at)].compact.max.strftime("%d.%m-%H:%M")
          mem[facet.name.to_sym] = Rails.cache.fetch("#{shortname}-facet-#{facet.id}-#{cache_key_date}") do
            ::FacetSerializer.new(rr).as_json
          end
        end
      when "Person", "Interview"
        facet_label_hash = facet.localized_hash(:label)
        name = facet_label_hash || localized_hash_for("search_facets", facet.name)

        case facet.name
        when "year_of_birth"
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
        when "interview_date"
          begin
            mem[facet.name.to_sym] = {
              name: name,
              subfacets: facet.source.classify.constantize.group(facet.name).count.keys.compact.inject({}) do |subfacets, key|
                localized_hash = I18n.available_locales.inject({}) do |acc, locale|
                  acc[locale] = key
                  acc
                end

                subfacets[key.to_s] = {
                  name: localized_hash,
                  count: 0,
                }
                subfacets
              end
            }
          rescue
          end
        # admin facets
        when "tasks_user_ids", "tasks_supervisor_ids"
          # add filters for tasks
          mem[facet.name.to_sym] = {
            name: name,
            subfacets: (User.joins(:user_roles) | User.where(admin: true)).inject({}) do |subfacets, user|
              subfacets[user.id.to_s] = {
                name: I18n.available_locales.inject({}) {|desc, locale| desc[locale] = user.full_name; desc},
                count: 0,
              }
              subfacets
            end
          }
        when "collection_id"
          facet_label_hash = facet.localized_hash(:label)
          cache_key_date = [Collection.maximum(:updated_at), facet.updated_at].compact.max.strftime("%d.%m-%H:%M")
          mem[facet.name.to_sym] = Rails.cache.fetch("#{shortname}-facet-#{facet.id}-#{cache_key_date}-#{Collection.count}") do
            {
              name: facet_label_hash || localized_hash_for("search_facets", facet.name),
              subfacets: ( is_ohd? ?
                Collection.joins(:project).where(project: {workflow_state: 'public'}) :
                collections
              ).includes(:translations).inject({}) do |subfacets, sf|
                subfacets[sf.id.to_s] = {
                  id: sf.id,
                  name: sf.localized_hash(:name),
                  count: 0,
                  homepage: sf.try(:localized_hash, :homepage),
                  institution: sf.institution.try(:localized_hash, :name),
                  notes: sf.try(:localized_hash, :notes),
                }
                subfacets
              end
            }
          end
        when "archive_id"
          # do nothing: should not be a facet!
        when "project_id"
          facet_label_hash = facet.localized_hash(:label)
          cache_key_date = [Project.maximum(:updated_at), facet.updated_at].compact.max.strftime("%d.%m-%H:%M")
          result = mem[facet.name.to_sym] = Rails.cache.fetch("#{shortname}-facet-#{facet.id}-#{cache_key_date}-#{Project.count}") do
            {
              name: facet_label_hash || localized_hash_for("search_facets", facet.name),
              subfacets: Project.shared.includes(:translations).inject({}) do |acc, project|
                acc[project.id.to_s] = {
                  name: project.localized_hash(:name),
                  count: 0
                }
                acc
              end
            }
          end
          result
        when 'language_id', 'primary_language_id', 'secondary_language_id', 'primary_translation_language_id'
          facet_label_hash = facet.localized_hash(:label)
          cache_key_date = [Language.maximum(:updated_at), facet.updated_at].compact.max.strftime("%d.%m-%H:%M")
          mem[facet.name.to_sym] = Rails.cache.fetch("#{shortname}-facet-#{facet.id}-#{cache_key_date}") do
            {
              name: facet_label_hash || localized_hash_for("search_facets", facet.name),
              subfacets: Language.all.includes(:translations).inject({}) do |subfacets, sf|
                subfacets[sf.id.to_s] = {
                  name: sf.localized_hash(:name),
                  count: 0
                }
                subfacets
              end
            }
          end
        when /_id$/ # belongs_to associations
          facet_label_hash = facet.localized_hash(:label)
          associatedModel = facet.name.sub('_id', '').classify.constantize
          cache_key_date = [associatedModel.maximum(:updated_at), facet.updated_at].compact.max.strftime("%d.%m-%H:%M")
          mem[facet.name.to_sym] = Rails.cache.fetch("#{shortname}-facet-#{facet.id}-#{cache_key_date}") do
            {
              name: facet_label_hash || localized_hash_for("search_facets", facet.name),
              subfacets: associatedModel.all.includes(:translations).inject({}) do |subfacets, sf|
                subfacets[sf.id.to_s] = {
                  name: sf.localized_hash(:name),
                  count: 0
                }
                subfacets
              end
            }
          end
        when "observations", "description"
          # do nothing: facets on individual free-text do not make sense
        when "tape_count"
          # do nothing: this is not meant to be a facet
        when "project_access"
          mem[:project_access] = {
            name: facet_label_hash || localized_hash_for("search_facets", :project_access),
            subfacets: %w(free restricted).inject({}) do |subfacets, access|
              subfacets[access] = {
                name: I18n.available_locales.inject({}) do |desc, locale|
                  desc[locale] = TranslationValue.for("search_facets.#{access}", locale)
                  desc
                end,
                count: 0
              }
              subfacets
            end
          }
        else
          begin
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
          rescue => e
            logger.warn "Could not create facet for #{facet.name}"
            logger.warn e.message
          end
        end
      end
      mem.with_indifferent_access
    end
  end

  def localized_hash_for(specifier, key = nil)
    key == "" && key = "nil"
    I18n.available_locales.inject({}) do |desc, locale|
      desc[locale] = TranslationValue.for([specifier, key].compact.join("."), locale)
      desc
    end
  end

  def updated_search_facets(search)
    facets = search_facets_hash.deep_dup

    # String facets.
    search_facets_names.each do |facet_name|
      facet = search.facet("search_facets:#{facet_name}")
      if facet.present?
        search.facet("search_facets:#{facet_name}").rows.each do |row|
          facets[facet_name][:subfacets][row.value][:count] = row.count if facets[facet_name][:subfacets][row.value]
        rescue StandardError => e
          p "*** facet: #{facet_name}, row.value: #{row.value}"
          p "*** error: #{e.message}"
        end
      end
    end

    # Date facets.
    event_facet_names.each do |facet_name|
      facet = search.facet("events:#{facet_name}")
      if facet.present?
        facets[facet_name] = {
          name: facet_name,
          subfacets: {},
          type: 'EventType'
        }
        facet.rows.each do |row|
          facets[facet_name][:subfacets][row.value] = row.count
        end
      end
    end

    # Delete facet values with zero count.
    facets.each do |k, facet|
      if facet[:type] != 'EventType'
        facet[:subfacets].delete_if { |k, subfacet| subfacet[:count] == 0 }
      end
    end

    facets
  end

end
