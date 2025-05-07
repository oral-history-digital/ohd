require 'globalize'
require 'tsort'
# require 'i18n/core_ext/string/interpolate'

class RegistryEntry < ApplicationRecord

  ROOT_NODE_ID = 1

  NAME_PATTERNS = {
      :person => ['%{last_name}, %{first_name}', :last_name, :first_name, :birth_name],
      :spelling => ['%{spelling}', :spelling]
  }

  INVALID_ENTRY_TEXT = 'Missing Translation'

  #ONIGURUMA_OPTIONS = {:options => Oniguruma::OPTION_IGNORECASE, :encoding => Oniguruma::ENCODING_UTF8}
  ONIGURUMA_OPTIONS = {:options => 'i', :encoding => 'utf8'}

  has_many :registry_names,
           -> { includes(:translations) },
           #-> { includes(:translations, :registry_name_type) },
           :dependent => :destroy
  accepts_nested_attributes_for :registry_names

  has_many :norm_data
  accepts_nested_attributes_for :norm_data

  has_many :gnd_norm_data,
           ->{ where(norm_data_provider_id: NormDataProvider.where(name: 'GND').first.id)},
           class_name: 'NormDatum'

  has_many :osm_norm_data,
           ->{ where(norm_data_provider_id: NormDataProvider.where(name: 'OSM').first.id)},
           class_name: 'NormDatum'

  has_many :parent_registry_hierarchies,
           foreign_key: :descendant_id,
           class_name: 'RegistryHierarchy',
           dependent: :destroy

  has_many :child_registry_hierarchies,
           foreign_key: :ancestor_id,
           class_name: 'RegistryHierarchy',
           dependent: :destroy

  has_many :ancestors,
           through: :parent_registry_hierarchies

  has_many :descendants,
           through: :child_registry_hierarchies

  has_many :registry_entry_relations
  has_many :related_registry_entries,
           through: :registry_entry_relations,
           source: :related

  has_many :registry_references,
           :dependent => :destroy

  # The following represents registry reference types
  # "allowed" for all entries that are descendants
  # of this entry.
  has_many :registry_reference_types,
           :dependent => :destroy

  has_many :main_registers,
    -> { where('EXISTS (SELECT * FROM registry_hierarchies parents WHERE parents.descendant_id = registry_hierarchies.ancestor_id AND parents.ancestor_id = 1') },
    :through => :links_as_descendant,
    :source => :ancestor

  belongs_to :project

  # Every registry entry (except for the root entry) must have at least one parent.
  # Otherwise we get orphaned registry entries.
  attr_writer :do_not_validate_parents
  #validate :must_have_parents
  #def must_have_parents
    #return if id == ROOT_NODE_ID || @do_not_validate_parents
    #if parents.empty?
      #errors[:base] << 'Ein Registereintrag braucht mindestens eine Klassifizierung.'
    #end
  #end

  translates :notes, touch: true, fallbacks_for_empty_translations: true
  accepts_nested_attributes_for :translations

  WORKFLOW_STATES = [:preliminary, :public, :hidden, :rejected]
  validates_inclusion_of :workflow_state, :in => WORKFLOW_STATES.map(&:to_s)
  validates :latitude, numericality: true, allow_blank: true
  validates :longitude, numericality: true, allow_blank: true

  after_update :touch_objects
  after_create :touch_objects
  before_destroy :touch_objects

  def parents
    ancestors
  end

  def children
    descendants
  end

  def public_registry_references_count
    registry_references.joins(:interview)
      .where('interviews.workflow_state': 'public')
      .count
  end

  # A registry entry may not be deleted if it still has children or
  # references pointing to it.
  def before_destroy
    touch_objects
    children.count == 0 and registry_references.count == 0
  end

  def touch_objects
    parents && parents.map(&:touch)
  end

  searchable do
    integer :project_id, :stored => true, :references => Project
    string :archive_id, :multiple => true, :stored => true do
      registry_references.map{|i| i.archive_id }
    end
    string :workflow_state
    (I18n.available_locales + ['orig']).each do |locale|
      text :"text_#{locale}", stored: true do
        descriptor(locale)
      end
      string :"text_#{locale}", stored: true do
        descriptor(locale)
      end
    end
    text :names
    #text :desc
  end

  scope :with_state, -> (workflow_state) {
    where(workflow_state: workflow_state)
  }

  # Order registry entries lexicographically by name even when they
  # consist of several distinct registry names (ie. several name
  # types or name positions).
  scope :ordered_by_name, ->(locale) {
    left_outer_joins(registry_names: [:translations, :registry_name_type]).
    where('registry_name_translations.locale = ? OR registry_name_translations.locale IS NULL', locale).
    group('registry_entries.id').
    order('GROUP_CONCAT(DISTINCT registry_name_translations.descriptor COLLATE utf8mb4_general_ci ORDER BY registry_name_types.order_priority, registry_names.name_position SEPARATOR " ")')
  }

  # Filter registry entries that have reference types defined on them.
  scope :with_reference_types,
        # The following is an INNER JOIN which will
        # automatically filter registry entries that
        # actually have registry reference types
        # defined.
        -> { joins(:registry_reference_types).
        # NB: Grouping doesn't work correctly with
        # the .size/.count method! Counting the number of
        # available reference types has to be done after
        # retrieving them.
        group('registry_entries.id') }

  scope :with_reference_to, -> (referenced_object) {
        joins(:registry_references).
        where(
            'registry_references.ref_object_id = ? AND registry_references.ref_object_type = ?',
            referenced_object.id, referenced_object.class.to_s
        )
  }

  scope :with_location, -> { where("latitude <> '' AND longitude <> ''")}

  # Get all registry entries with names so that a tree can be built by the frontend.
  # TODO: Decide wether workflow_state should be 'public'.
  scope :for_tree, -> (locale, project_id) {
    joins('LEFT OUTER JOIN registry_hierarchies ON registry_entries.id = registry_hierarchies.descendant_id INNER JOIN registry_names ON registry_entries.id = registry_names.registry_entry_id INNER JOIN registry_name_translations ON registry_names.id = registry_name_translations.registry_name_id INNER JOIN registry_name_types ON registry_names.registry_name_type_id = registry_name_types.id')
    .where("registry_name_translations.locale = ? OR registry_entries.code = 'root'", locale)
    .where(project_id: project_id)
    .group('registry_entries.id, registry_hierarchies.ancestor_id')
    .select('registry_entries.id, GROUP_CONCAT(registry_name_translations.descriptor ORDER BY registry_names.name_position ASC, registry_name_types.order_priority ASC SEPARATOR \', \') AS label, registry_hierarchies.ancestor_id AS parent')
  }

  def parent_id=(pid)
    RegistryHierarchy.create(ancestor_id: pid, descendant_id: id)
  end

  def names
    registry_names.map do |rn|
      rn.translations.map do |t|
        t.descriptor
      end
    end.flatten.uniq.join(' ')
  end

  def names_w(locale)
    registry_names.
      includes(:translations, :registry_name_type).
      where("registry_name_translations.locale": locale).
      order('registry_name_types.order_priority').
      map do |rn|
      rn.translations.map do |t|
        t.descriptor
      end
    end.flatten.uniq.join(', ')
  end

  class << self
    def ohd_subjects
      find 21898673
    end

    def ohd_level_of_indexing
      find 21898470
    end

    def merge(opts={})
      merge_to_id = opts[:id]
      where(id: opts[:ids]).each do |registry_entry|
        registry_entry.move_associated_to(merge_to_id)
        registry_entry.reload
        registry_entry.destroy
      end
    end

    def pdf_entries(project)
      where(id: project.pdf_registry_entry_ids).includes(registry_names: :translations).map{|e| e.all_relatives}.flatten.sort{|a, b| a.descriptor <=> b.descriptor}
    end

    def csv_entries(project)
      project.registry_entries.includes(registry_names: :translations).map{|e| e.all_relatives}
    end
  end

  def move_associated_to merge_to_id
    registry_entry_relations.each{|r| r.update_attribute(:registry_entry_id, merge_to_id)}
    registry_references.each{|r| r.update_attribute(:registry_entry_id, merge_to_id)}

    child_registry_hierarchies.update_all(ancestor_id: merge_to_id)
    parent_registry_hierarchies.destroy_all
  end

  def all_relatives(descending=true)
    method = descending ? :descendants : :ancestors
    all = [send(method).includes(registry_names: [:translations, :registry_name_type])]
    send(method).each do |d|
      unless d.descendants.include?(self)
        all << d.all_relatives(descending)
      end
    end
    all.flatten
  end

  def on_all_descendants(&block)
    descendants.each do |d|
      block.call d
      unless d.descendants.include?(self)
        d.on_all_descendants(&block)
      end
    end
  end

  def get_first_descendant_of(code)
    parents.first.code == code ? self : parents.first.get_first_descendant_of(code)
  end

  def search_project_id
    project_id || (parents.first && parents.first.search_project_id)
  end

  def bread_crumb
    if (parents - children).count > 0
      (parents - children).inject({}){|mem, parent| mem[parent.id] = parent.bread_crumb; mem}
    end
  end

  def find_descendant_by_name(name, locale)
    return nil if name.blank?
    entry = descendants.joins(registry_names: :translations).
      where("registry_name_translations.locale = ?", locale).
      where("registry_name_translations.descriptor = ?", name).
      first
    if entry
      return entry
    else
      descendants.each do |descendant|
        entry = descendant.find_descendant_by_name(name, locale)
        return entry if entry
      end
    end
    nil
  end

  def create_child(name, locale)
    child = RegistryEntry.create workflow_state: "public", list_priority: false, project_id: project.id
    RegistryHierarchy.create(ancestor_id: self.id, descendant_id: child.id)
    child.registry_names << RegistryName.create(registry_entry_id: child.id, registry_name_type_id: 1, name_position: 0, descriptor: name, locale: locale)
    child
  end

  class << self
    def descendant_ids(code, entry_dedalo_code=nil)
      entry = entry_dedalo_code ? find_by_entry_dedalo_code(entry_dedalo_code) : find_by_code(code)
      entry ? entry.child_registry_hierarchies.map(&:decendant_id) : []
    end

    #
    # names_w_locales is a string like "de::Herr;Heinz;Huber#en::Mister;Heinz;Huber"
    # so # is the delimiter between different language versions
    # :: delimits between locale and the words
    # ; delimits between the different names of a registry_entry
    # name positions are given by the order
    #
    def create_with_parent_and_names(project, parent_id, names_w_locales, code=nil)
      registry_entry = RegistryEntry.create code: code, desc: code, workflow_state: "public", list_priority: false, project_id: project.id
      RegistryHierarchy.create(ancestor_id: parent_id, descendant_id: registry_entry.id) if parent_id

      names_w_locales.gsub("\"", '').split('#').each do |name_w_locale|
        locale, names = name_w_locale.split('::')
        names.split(';').each_with_index do |name, index|
          registry_name = registry_entry.registry_names.find_by_name_position index
          if registry_name
            registry_name.update descriptor: name, locale: locale
          else
            RegistryName.create registry_entry_id: registry_entry.id, registry_name_type_id: 1, name_position: index, descriptor: name, locale: locale
          end
        end
      end
      registry_entry
    end

    def find_or_create_descendant(project, parent_code, descendant_name)
      descendant = nil
      parent = RegistryEntry.where(code: parent_code, project_id: project.id).first
      locale, names = descendant_name.split('::')
      parent.children.each do |c|
        descendant = c if c.names_w(locale) == names
        #descendant = c if c.registry_names.first.translations.map(&:descriptor).include?(descendant_name)
      end

      if descendant.nil? && descendant_name.length > 2
        descendant = RegistryEntry.create_with_parent_and_names(project, parent.id, descendant_name, names.gsub(/[\s+,]/, '_').downcase)
      end
      descendant
    end

    # This is not a translated class but it can accept localized descriptors.
    def with_locale(locale)
      previous_locale, self.locale = self.locale, locale
      begin
        result = yield
      ensure
        self.locale = previous_locale
      end
      result
    end

    def create_with_name!(attributes = {})
      registry_entry = build_with_name(attributes)
      registry_entry.save!
      registry_entry
    end

  end

  def available_translations
    registry_names.map { |n| n.translations.map{|t| t.locale[0..1]} }.flatten.uniq
  end

  # normdata methods
  #
  %w(gnd osm).each do |provider|
    define_method "#{provider}_id=" do |nid|
      if nid
        norm_datum = self.send("#{provider}_norm_data").first_or_initialize
        norm_datum.nid = nid
        norm_datum.save
      end
    end

    define_method "#{provider}_id" do
      norm_datum = self.send("#{provider}_norm_data").first
      norm_datum && norm_datum.nid
    end
  end

  def descriptor=(descriptor)
    # do not overwrite the first names descriptor with the
    # joined descriptors of all other names (gathered from e.g. registry_entries-export)
    #
    if registry_names.count == 1
      name = registry_names.first
      name && name.update(descriptor: descriptor)
    end
  end

  def descriptor(locale = I18n.default_locale)
    to_s(locale)
  end

  def parent_id=(pid)
    unless parents.map(&:id).include? pid.to_i
      parents << RegistryEntry.find(pid)
    end
  end

  def to_s(locale = I18n.default_locale)
    registry_names.
      includes(:translations, :registry_name_type).
      #where("registry_name_translations.locale": locale).
      order('registry_name_types.order_priority').
      group_by{|rn| rn.registry_name_type_id}.
      map do |tid, rns|
        birth_name = rns.first.registry_name_type && rns.first.registry_name_type.code == 'birth_name'
        names = rns.map{|rn| rn.descriptor(locale)}.join(" ")
        birth_name ? "#{TranslationValue.for('search_facets.born', locale)} #{names}" : names
      end.
      join(", ")
      #group_by{|rn| rn.registry_name_type_id}.
      #map{|tid, rns| rns.map(&:descriptor).join(" ")}.
      #join(", ")
  end

  def delete_persistent_values=(bool)
    if bool
      registry_names.destroy_all
      norm_data.destroy_all
    end
  end
end
