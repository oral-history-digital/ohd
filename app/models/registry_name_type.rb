class RegistryNameType < ApplicationRecord
  has_many :registry_names
  belongs_to :project, touch: true

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
