require 'globalize'

class RegistryName < ApplicationRecord
  include RefreshesSearchIndex

  belongs_to :registry_entry, touch: true
  belongs_to :registry_name_type

  translates :descriptor, touch: true, fallbacks_for_empty_translations: true
  accepts_nested_attributes_for :translations

  refresh_search_index_on :registry_entry_id, :registry_name_type_id, :name_position,
    translations: [:descriptor]

  # Refreshes indexed names for both registry entries when a name is reassigned.
  #
  # @return [Hash{String => Array<Integer>}] Affected registry documents
  def search_index_targets
    { 'RegistryEntry' => ([registry_entry_id] + Array(saved_change_to_registry_entry_id)).compact.uniq }
  end

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

  def descriptor_without_fallback(locale)
    translation = translations.find_by(locale: locale.to_s)
    translation ? translation.descriptor : nil
  end
end
