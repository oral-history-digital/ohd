class RegistryNameType < ApplicationRecord
  has_many :registry_names
  belongs_to :project, touch: true
  translates :name, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

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
