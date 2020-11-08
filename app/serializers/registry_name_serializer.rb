class RegistryNameSerializer < ApplicationSerializer
  attributes :id,
             :registry_entry_id,
             :registry_name_type_id,
             :name_position,
             :descriptor,
             :notes

  def descriptor
    object.localized_hash(:descriptor)
  end

  def notes
    object.localized_hash(:notes)
  end

end
