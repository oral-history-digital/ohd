require 'globalize'
class MetadataField < ApplicationRecord

  belongs_to :project, touch: true
  belongs_to :registry_entry
  belongs_to :registry_reference_type

  translates :label, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations
  serialize :values
  validates_uniqueness_of :name, :scope => [:project_id]

end
