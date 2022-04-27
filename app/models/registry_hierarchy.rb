class RegistryHierarchy < ApplicationRecord

  belongs_to :descendant, class_name: 'RegistryEntry', counter_cache: :parents_count, touch: true
  belongs_to :ancestor, class_name: 'RegistryEntry', counter_cache: :children_count, touch: true

end
