require 'globalize'

class RegistryName < ActiveRecord::Base

  belongs_to :registry_entry
  belongs_to :registry_name_type

  translates :descriptor, :notes

  scope :ordered_by_type,
              -> { joins(:registry_name_type).
                   order('registry_name_types.order_priority, registry_names.name_position') }

  scope :with_type, -> (code) { where(registry_name_types: {code: code.to_s}) }

end
