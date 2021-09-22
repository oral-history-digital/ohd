require "globalize"

class Project < ApplicationRecord

  has_many :logos, as: :ref, dependent: :destroy
  has_many :sponsor_logos, as: :ref, dependent: :destroy

  has_many :interviews, dependent: :destroy
  has_many :collections, dependent: :destroy
  has_many :contribution_types, dependent: :destroy
  has_many :media_streams, dependent: :destroy
  has_many :metadata_fields, dependent: :destroy
  has_many :task_types, dependent: :destroy
  has_many :roles, dependent: :destroy
  has_many :external_links, dependent: :destroy
  has_many :registry_entries, dependent: :destroy
  has_many :user_registration_projects, dependent: :destroy
  has_many :user_registrations,
    through: :user_registration_projects

  has_many :registry_reference_types, dependent: :destroy
  has_many :registry_name_types, dependent: :destroy
  has_many :people, dependent: :destroy

  translates :name, :introduction, :more_text, :landing_page_text, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  validates_uniqueness_of :initials, allow_blank: true

  serialize :view_modes, Array
  serialize :available_locales, Array
  serialize :upload_types, Array
  #serialize :name, Array
  serialize :funder_names, Array
  serialize :hidden_registry_entry_ids, Array
  serialize :hidden_transcript_registry_entry_ids, Array
  serialize :pdf_registry_entry_ids, Array
  # serialize :fullname_on_landing_page

  #
  # define pseudo-methods for serialized attributes
  #
  # if params[:available_locales] = "de,en,ru" (a string!!) it can not be serialized
  # therefore the string-values from the params-hash are splitted  first
  #
  [:view_modes, :available_locales, :upload_types, :funder_names, :hidden_registry_entry_ids, :pdf_registry_entry_ids, :hidden_transcript_registry_entry_ids].each do |m|
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
  validates :initials, format: { with: /\A[a-zA-Z]+\z/ },  allow_nil: true
  validates :shortname, format: { with: /\A[a-zA-Z]+\z/ },  presence: true

  before_save :touch_interviews
  def touch_interviews
    interviews.each(&:touch) if landing_page_text_changed?
  end

  after_create :create_root_registry_entry
  def create_root_registry_entry
    root = RegistryEntry.create(project_id: self.id, code: 'root', workflow_state: 'public')
    RegistryName.create registry_entry_id: root.id, registry_name_type_id: 1, name_position: 0, descriptor: 'Register', locale: :de
  end

  after_create :create_default_registry_name_type
  def create_default_registry_name_type
    RegistryNameType.create code: "spelling", name: "Bezeichner", order_priority: 3, project_id: self.id
  end

  after_create :create_contribution_types
  def create_contribution_types
    %w(
      interviewee
      interviewer
      cinematographer
      sound
      producer
      other_attender
      quality_manager_interviewing
      transcriptor
      segmentator
      translator
      proofreader
      research
    ).each do |code|
      ContributionType.create code: code, label: I18n.t("contributions.#{code}", locale: :de), locale: :de
    end
  end

  after_create :create_task_types
  def create_task_types
    {
      media_import: ['Medienimport (A/V)', 'Med'],
      approval: ['Einverständnis', 'EV'],
      protocol: ['Protokoll', 'Pro'],
      transcript: ['Transkript', 'Trans'],
      translation_transcript: ['Übersetzung/Transkript', 'Ü/Trans'],
      metadata: ['Metadaten', 'Met'],
      translation_metadata: ['Übersetzung/Metadaten', 'Ü/Met'],
      photos: ['Fotos', 'Fot'],
      translation_photos: ['Übersetzung/ Fotos', 'Ü/Fot'],
      biography: ['Kurzbiografie', 'Bio'],
      translation_biography: ['Übersetzung/Kurzbiografie', 'Ü/Bio'],
      table_of_contents: ['Inhaltsverzeichnis', 'Inh'],
      translation_table_of_contents: ['Übersetzung/Inhaltsverzeichnis', 'Ü/Inh'],
      register: ['Register', 'Reg'],
      translation_register: ['Übersetzung/Register', 'Ü/Reg'],
      annotations: ['Anmerkungen', 'Anm'],
      anonymisation: ['Anonymisierung' 'Ano']
    }.each do |key, (label, abbreviation)|
      TaskType.create key: key, label: label, abbreviation: abbreviation, project_id: self.id, use: true
    end
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

    # TODO: fit this method
    def current
      first
    end

    def archive_domains
      where.not(shortname: 'ohd').map do |project|
        uri = Addressable::URI.parse(project.archive_domain)
        uri && uri.host
      end.compact
    end

    def by_host(host)
      all.find do |project|
        uri = Addressable::URI.parse(project.archive_domain)
        uri && uri.host == host
      end
    end

    def by_identifier(identifier)
      where(["lower(shortname) = :value", { value: identifier.downcase }]).first
    end
  end

  def identifier
    shortname.downcase
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
    Rails.cache.delete_matched /^#{cache_key_prefix}-#{namespace}*/
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
          cache_key_date = [rr.updated_at, facet.updated_at].compact.max.strftime("%d.%m-%H:%M")
          mem[facet.name.to_sym] = Rails.cache.fetch("#{cache_key_prefix}-facet-#{facet.id}-#{cache_key_date}") do
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
        when "tasks_user_account_ids", "tasks_supervisor_ids"
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
        when "collection_id"
          facet_label_hash = facet.localized_hash(:label)
          cache_key_date = [Collection.maximum(:updated_at), facet.updated_at].compact.max.strftime("%d.%m-%H:%M")
          mem[facet.name.to_sym] = Rails.cache.fetch("#{cache_key_prefix}-facet-#{facet.id}-#{cache_key_date}") do
            {
              name: facet_label_hash || localized_hash_for("search_facets", facet.name),
              subfacets: collections.includes(:translations).inject({}) do |subfacets, sf|
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
        when "archive_id"
          # do nothing: should not be a facet!
        when /_id$/ # belongs_to associations like language on interview
          facet_label_hash = facet.localized_hash(:label)
          associatedModel = facet.name.sub('_id', '').classify.constantize
          cache_key_date = [associatedModel.maximum(:updated_at), facet.updated_at].compact.max.strftime("%d.%m-%H:%M")
          mem[facet.name.to_sym] = Rails.cache.fetch("#{cache_key_prefix}-facet-#{facet.id}-#{cache_key_date}") do
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
          rescue
          end
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
