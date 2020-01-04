class RegistryReferenceTypeSerializer < ApplicationSerializer
  attributes :id,
             :code,
             :name,
             :registry_reference_ids,
             :registry_entry_id,
             :registry_entry_code,
             :display_on_landing_page,
             :ref_object_type

  def name
    MetadataField.where(name: object.code, source: 'RegistryReferenceType').first.localized_hash(:label) || object.localized_hash(:name)
  end

  def registry_entry_code
    object.try(:registry_entry).try(:code) || ""
  end

  def display_on_landing_page
    MetadataField.where(name: object.code, source: 'RegistryReferenceType', display_on_landing_page: true).exists?
    #Project.person_properties_RegistryReferenceType.select{|p| p['id'] == object.code}.first['display_on_landing_page']
  end

  def ref_object_type
    MetadataField.where(name: object.code, source: 'RegistryReferenceType').first.ref_object_type
  end
end
