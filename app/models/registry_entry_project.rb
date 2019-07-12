class RegistryEntryProject < ApplicationRecord
  belongs_to :registry_entry
  belongs_to :project
end
