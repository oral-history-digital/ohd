require 'globalize'
class MetadataField < ApplicationRecord

  belongs_to :project
  belongs_to :registry_entry
  belongs_to :registry_reference_type

  translates :label, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations
  serialize :values

  before_destroy :touch_project #in order to generate a new cache key

  def touch_project
    project.touch
  end
end
