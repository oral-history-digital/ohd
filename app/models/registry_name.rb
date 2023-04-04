require 'globalize'

class RegistryName < ApplicationRecord

  belongs_to :registry_entry, touch: true
  belongs_to :registry_name_type

  translates :descriptor, touch: true, fallbacks_for_empty_translations: true
  accepts_nested_attributes_for :translations

  scope :ordered_by_type,
              -> { joins(:registry_name_type).
                   order('registry_name_types.order_priority, registry_names.name_position') }

  scope :with_type, -> (code) { where(registry_name_types: {code: code.to_s}) }

  scope :select_local_descriptor, ->(locale) {
          joins(:translations).select("registry_name_translations.descriptor AS name, registry_entry_id")
  }

  def name_position=(val)
    self[:name_position] = val.to_i
  end

end
