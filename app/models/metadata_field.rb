require 'globalize'
class MetadataField < ApplicationRecord

  belongs_to :project, touch: true
  belongs_to :registry_reference_type
  belongs_to :event_type
  validates_uniqueness_of :registry_reference_type_id,  allow_nil: true
  validates_uniqueness_of :event_type_id, allow_nil: true

  translates :label, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations
  serialize :values

  validates_presence_of :name
  validates_uniqueness_of :name, :scope => [:project_id, :source]

  validates_format_of :map_color, with: /\A#([0-9a-f]{3}|[0-9a-f]{6})\z/i

  before_validation :set_name

  def set_name
    self.name = registry_reference_type.code if registry_reference_type
  end
end
