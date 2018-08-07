class RegistryReferenceSerializer < ActiveModel::Serializer

  attributes :id,
             :ref_object_id,
             :ref_object_type,
             :registry_entry_id

end
