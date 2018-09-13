class RegistryReferenceTypeSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :registry_reference_ids,
             :registry_entry_id,
             :registry_entry_code

  def name
    object.localized_hash
  end

  def registry_entry_code
    object.try(:registry_entry).try(:entry_code) || ''
  end
  
end
