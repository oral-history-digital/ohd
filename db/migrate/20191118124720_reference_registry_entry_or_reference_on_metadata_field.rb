class ReferenceRegistryEntryOrReferenceOnMetadataField < ActiveRecord::Migration[5.2]
  def change
    add_column :metadata_fields, :registry_entry_id, :integer
    add_column :metadata_fields, :registry_reference_type_id, :integer

    MetadataField.where(source: 'RegistryEntry').each do |m|
      re = RegistryEntry.find_by_code(m.name);
      m.update_attribute :registry_entry_id, re.id if re
    end

    MetadataField.where(source: 'RegistryReferenceType').each do |m|
      rr = RegistryReferenceType.find_by_code(m.name)
      m.update_attributes registry_entry_id: rr.registry_entry_id, registry_reference_type_id: rr.id if rr
    end
  end
end
