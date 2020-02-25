class RegistryReferenceSerializer < ApplicationSerializer
  attributes :id,
             :ref_object_id,
             :ref_object_type,
             :registry_entry_id,
             :registry_reference_type_id,
             :archive_id,
             :ref_info,
             :ref_details

end
