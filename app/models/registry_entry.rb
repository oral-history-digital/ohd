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

  has_many :parent_registry_hierarchies,
           foreign_key: :descendant_id,
           class_name: 'RegistryHierarchy'

  has_many :child_registry_hierarchies,
           foreign_key: :ancestor_id,
           class_name: 'RegistryHierarchy'

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

  has_many :registry_entry_projects
  has_many :projects,
    through: :registry_entry_projects

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

  WORKFLOW_STATES = [:preliminary, :checked, :hidden, :rejected]
  validates_inclusion_of :workflow_state, :in => WORKFLOW_STATES.map(&:to_s)
  validates :latitude, numericality: true, allow_blank: true
  validates :longitude, numericality: true, allow_blank: true

  after_update :touch_objects
  after_create :touch_objects

  def parents
    ancestors
  end

  def children 
    descendants
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
    string :archive_id, :multiple => true, :stored => true do
      registry_references.map{|i| i.archive_id } 
    end
    string :workflow_state
    I18n.available_locales.each do |locale|
      text :"text_#{locale}", stored: true do
        descriptor(locale)
      end
      string :"text_#{locale}", stored: true do
        descriptor(locale)
      end
    end
    #text :desc
  end

  scope :with_state, -> (workflow_state) {
    where(workflow_state: workflow_state)
  }

  # Order registry entries lexicographically by name even when they
  # consist of several distinct registry names (ie. several name
  # types or name positions).
  scope :ordered_by_name, ->(locale) { 
    joins(registry_names: [:translations, :registry_name_type]).
    where('registry_name_translations.locale': locale).
    group('registry_entries.id').
    order('registry_entries.list_priority DESC').
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

  def identifier
    id
  end

  def identifier_method
    'id'
  end

  searchable do
    text :names
  end

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

  def self.merge(opts={})
    merge_to_id = opts[:id]
    where(id: opts[:ids]).each do |registry_entry|
      registry_entry.move_associated_to(merge_to_id)
      registry_entry.destroy
    end
  end

  def move_associated_to merge_to_id
    registry_entry_relations.each{|r| r.update_attribute(:registry_entry_id, merge_to_id)}
    registry_references.each{|r| r.update_attribute(:registry_entry_id, merge_to_id)}

    child_registry_hierarchies.each do |rh| 
      if RegistryHierarchy.where(ancestor_id: merge_to_id, descendant_id: rh.descendant_id).exists?
        rh.destroy 
      else
        rh.update_attribute(:ancestor_id, merge_to_id) 
      end
    end

    parent_registry_hierarchies.each do |rh| 
      if RegistryHierarchy.where(ancestor_id: rh.ancestor_id, descendant_id: merge_to_id).exists?
        rh.destroy
      else
        rh.update_attribute(:descendant_id, merge_to_id) 
      end
    end
  end

  def self.pdf_entries(project)
    where(id: project.pdf_registry_entry_ids).includes(registry_names: :translations).map{|e| e.all_relatives}.flatten.sort{|a, b| a.descriptor <=> b.descriptor}
  end

  def self.csv_entries(project)
    project.registry_entries.includes(registry_names: :translations).map{|e| e.all_relatives}
  end

  def all_relatives(descending=true)
    method = descending ? :descendants : :ancestors
    all = [send(method).includes(registry_names: [:translations, :registry_name_type])]
    send(method).each do |d|
      all << d.all_relatives(descending)
    end
    all.flatten
  end

  def on_all_descendants(&block)
    descendants.each do |d|
      block.call d
      d.on_all_descendants(&block)
    end
  end

  def bread_crumb
    if parents.count > 0
      parents.inject({}){|mem, parent| mem[parent.id] = parent.bread_crumb; mem} 
    end
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
    def create_with_parent_and_names(parent_id, names_w_locales, code=nil)
      registry_entry = RegistryEntry.create code: code, desc: code, workflow_state: "public", list_priority: false
      RegistryHierarchy.create(ancestor_id: parent_id, descendant_id: registry_entry.id) if parent_id

      names_w_locales.gsub("\"", '').split('#').each do |name_w_locale| 
        locale, names = name_w_locale.split('::')
        names.split(';').each_with_index do |name, index|
          registry_name = registry_entry.registry_names.find_by_name_position index
          if registry_name
            registry_name.update_attributes descriptor: name, locale: locale
          else
            RegistryName.create registry_entry_id: registry_entry.id, registry_name_type_id: 1, name_position: index, descriptor: name, locale: locale
          end
        end
      end
      registry_entry
    end

    def find_or_create_descendant(parent_code, descendant_name)
      descendant = nil
      parent = find_by_code parent_code
      locale, names = descendant_name.split('::')
      parent.children.each do |c| 
        descendant = c if c.names_w(locale) == names
        #descendant = c if c.registry_names.first.translations.map(&:descriptor).include?(descendant_name)
      end

      if descendant.nil? && descendant_name.length > 2
        descendant = RegistryEntry.create_with_parent_and_names(parent.id, descendant_name, names.gsub(/\s+/, '_').downcase) 
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

    def root_node
      @root_node ||= RegistryEntry.first #find(RegistryEntry::ROOT_NODE_ID)
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

  def descriptor=(descriptor)
    # do not overwrite the first names descriptor with the 
    # joined descriptors of all other names (gathered from e.g. registry_entries-export)
    #
    if registry_names.count == 1
      name = registry_names.first
      name && name.update_attributes(descriptor: descriptor)
    end
  end

  def descriptor(locale = I18n.default_locale)
    to_s(locale)
  end

  def notes(locale)
    registry_names.first.notes(locale)
  end

  def notes=(notes)
    # do not overwrite the first names note with the 
    # joined notes of all other names (gathered from e.g. registry_entries-export)
    #
    if registry_names.count == 1
      name = registry_names.first
      name && name.update_attributes(notes: notes)
    end
  end

  def parent_id=(pid)
    unless parents.map(&:id).include? pid.to_i
      parents << RegistryEntry.find(pid)
    end
  end

  def localized_notes_hash
    I18n.available_locales.inject({}) do |mem, locale|
      name = registry_names.first
      mem[locale] = name && name.notes(locale)
      mem
    end
  end

  def to_s(locale = I18n.default_locale)
    registry_names.
      includes(:translations, :registry_name_type).
      #where("registry_name_translations.locale": locale).
      order('registry_name_types.order_priority').
      map do |rn|
        rn.descriptor(locale)
      end.flatten.uniq.join(', ')
  end

end
