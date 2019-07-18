class RegistryReferenceTypeSerializer < ApplicationSerializer
  attributes [:id,
              :code,
              :name,
              :registry_reference_ids,
              :registry_entry_id,
              :registry_entry_code,
              :display_on_landing_page,
              :ref_object_type]

  def name
    Project.metadata_fields_registry_reference_type.select { |p| p["name"] == object.code }.first["label"] || object.localized_hash
  end

  def registry_entry_code
    object.try(:registry_entry).try(:entry_code) || ""
  end

  def display_on_landing_page
    Project.metadata_fields_registry_reference_type.select { |p| p["name"] == object.code }.first["display_on_landing_page"]
  end

  def ref_object_type
    Project.metadata_fields_registry_reference_type.select { |p| p["name"] == object.code }.first["ref_object_type"]
  end
end
