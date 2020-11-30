class RegistryReferenceTypeSerializer < ApplicationSerializer
  attributes :id,
             :code,
             :name,
             :registry_reference_ids,
             :registry_entry_id,
             :registry_entry_code,
             :use_in_transcript

  def name
    object.localized_hash(:name) || MetadataField.where(name: object.code, source: 'RegistryReferenceType').first.localized_hash(:label) 
  end

  def registry_entry_code
    object.try(:registry_entry).try(:code) || ""
  end

end
