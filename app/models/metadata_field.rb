require 'globalize'
class MetadataField < ApplicationRecord

  belongs_to :project, touch: true
  belongs_to :registry_reference_type
  belongs_to :event_type

  translates :label, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations
  serialize :values

  validates :source,
    inclusion: { in: %w(Person Interview RegistryReferenceType GlobalRegistryReferenceType EventType),
    message: '%{value} is not a valid source' }
  validates_presence_of :name
  validates_uniqueness_of :registry_reference_type_id, allow_nil: true,
    scope: [:project_id]
  validates :event_type_id, uniqueness: true, allow_nil: true
  validates_uniqueness_of :name, :scope => [:project_id, :source]
  validates_format_of :map_color, with: /\A#([0-9a-f]{3}|[0-9a-f]{6})\z/i

  before_validation :set_name

  def set_name
    self.name = case source
                when 'RegistryReferenceType', 'GlobalRegistryReferenceType'
                  registry_reference_type&.code
                when 'EventType'
                  event_type&.code
                else
                  self.name
                end
  end

  after_commit do
    if use_as_facet_previously_changed?
      # commentedout because it makes the rake task maintenance:create_ohd_project run eternally
      #Sunspot.index!(project.is_ohd? ? Interview.all : project.interviews)
    end
  end

end
