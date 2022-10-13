class RegistryNameSerializer < ApplicationSerializer
  attributes :id,
             :registry_entry_id,
             :registry_name_type_id,
             :name_position,
             :descriptor

  def descriptor
    object.localized_hash(:descriptor)
  end

  def project_id
    object.registry_entry.project_id
  end

end
