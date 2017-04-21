class RegistryNameType < ActiveRecord::Base
  has_many :registry_names

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
