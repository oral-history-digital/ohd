class RegistryReferenceTypeSerializer < ApplicationSerializer
  attributes :id,
             :name,
             :registry_reference_ids,
             :registry_entry_id,
             :registry_entry_code,
             :display_on_landing_page,
             :ref_object_type,
             def name
               Project.metadata_fields_registry_reference_type.select { |p| p["name"] == object.code }.first["label"] || object.localized_hash
             end

  def registry_entry_code
    object.try(:registry_entry).try(:code) || ""
  end

  def display_on_landing_page
    MetadataField.where(name: object.code, source: 'registry_reference_type', display_on_landing_page: true).exists?
    #Project.person_properties_registry_reference_type.select{|p| p['id'] == object.code}.first['display_on_landing_page']
  end

  def ref_object_type
    MetadataField.where(name: object.code, source: 'registry_reference_type').first.ref_object_type
  end
end
