class RegistryHierarchy < ApplicationRecord

  belongs_to :descendant, class_name: 'RegistryEntry', counter_cache: :parents_count
  belongs_to :ancestor, class_name: 'RegistryEntry', counter_cache: :children_count

  after_create :touch_objects
  before_destroy :touch_objects

  def touch_objects
    ancestor && ancestor.touch
    descendant && descendant.touch
  end

end
