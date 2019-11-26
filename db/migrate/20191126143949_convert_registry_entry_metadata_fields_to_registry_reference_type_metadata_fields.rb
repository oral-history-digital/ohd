class ConvertRegistryEntryMetadataFieldsToRegistryReferenceTypeMetadataFields < ActiveRecord::Migration[5.2]
  def change
    MetadataField.where(name: "person_reference").destroy_all

    MetadataField.where(source: "RegistryEntry").each do |metadata_field|

      original_name = metadata_field.name
      singular_name = metadata_field.name.gsub(/s$/, '')

      rr_type = RegistryReferenceType.create(
          registry_entry_id: RegistryEntry.find_by_code(original_name).id,
          code: singular_name,
      )

      metadata_field.update_attributes({
          name: singular_name, 
          source: "RegistryReferenceType",
          registry_reference_type_id: rr_type.id,
          ref_object_type: "Person",
      })

      # after creation of new RegistryReferenceType and renaming of metadata field code into singularis:

      RegistryEntry.find_by_code(original_name).children.map(&:id).map{|id|RegistryReference.where(registry_entry_id: id)}.flatten.each do |rr|
          rr.update_attributes({
              registry_reference_type_id: rr_type.id,
              ref_object_type: "Person",
              ref_object_id: Interview.find(rr.ref_object_id).interviewees.first.id,
          })
      end
    end
  end

end
