class RegistryReferenceSerializer < ApplicationSerializer
  attributes :id,
             :ref_object_id,
             :ref_object_type,
             :registry_entry_id,
             :registry_reference_type_id,
             #  :registry_reference_type,
             :archive_id,
             :ref_info,
             :ref_details,
             :workflow_states,
             :workflow_state

  # def registry_reference_type
  #   RegistryReferenceTypeSerializer.new(object.registry_reference_type)
  # end
end
