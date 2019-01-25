class RegistryEntryRelation < ApplicationRecord
  belongs_to :registry_entry
  belongs_to :related, class_name: 'RegistryEntry'
end
