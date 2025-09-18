class RegistryNameType < ApplicationRecord
  has_many :registry_names
  belongs_to :project, touch: true
  translates :name, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  after_save :touch_registry_entries

  def touch_registry_entries
    if order_priority_previously_changed?
      RegistryEntry.where(id: registry_names.select(:registry_entry_id).distinct).touch_all
      project&.touch
    end
  end

  def to_s
    name
  end

  def to_sym
    code.to_sym
  end

  def to_hash
    {
        :id => id,
        :name => name,
        :code => code,
        :allowsMultiple => allows_multiple,
        :mandatory => mandatory
    }
  end
end
