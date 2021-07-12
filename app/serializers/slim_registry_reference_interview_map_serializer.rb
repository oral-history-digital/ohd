class SlimRegistryReferenceInterviewMapSerializer < ActiveModel::Serializer
  attributes :id, :ref_object_type, :registry_reference_type_id#, :map_color, :label
end
