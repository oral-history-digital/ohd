class RegistryHierarchy < ApplicationRecord

  belongs_to :descendant, class_name: 'RegistryEntry'
  belongs_to :ancestor, class_name: 'RegistryEntry'

  after_create :touch_objects
  before_destroy :touch_objects

  def touch_objects
    ancestor && ancestor.touch
    descendant && descendant.touch
  end

end
