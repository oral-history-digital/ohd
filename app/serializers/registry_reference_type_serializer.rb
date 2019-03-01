class RegistryReferenceTypeSerializer < ApplicationSerializer
  attributes :id,
             :name,
             :registry_reference_ids,
             :registry_entry_id,
             :registry_entry_code,
             :display_on_landing_page

  def name
    object.localized_hash
  end

  def registry_entry_code
    object.try(:registry_entry).try(:entry_code) || ''
  end

  def display_on_landing_page
    Project.person_properties_registry_reference_type.select{|p| p['id'] == object.code}.first['display_on_landing_page']
  end
  
end
