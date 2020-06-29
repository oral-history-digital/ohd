class AddUseInMapSearchToMetadataFields < ActiveRecord::Migration[5.2]
  def change
    add_column :metadata_fields, :use_in_map_search, :boolean

    if Project.first.identifier.to_sym == 'zwar'

      RegistryReferenceType.find_by_code('companie').update_attributes code: 'company'
      RegistryEntry.find_by_code('companie').update_attributes code: 'company'

      %w(camp company).each do |code|
        MetadataField.create(name: code, 
                             use_in_map_search: true, 
                             ref_object_type: "Person", 
                             source: "RegistryReferenceType", 
                             registry_entry_id: RegistryEntry.find_by_code(code).id,
                             registry_reference_type_id: RegistryReferenceType.find_by_code(code).id,
                             project_id: Project.first.id
                            )
      end
      MetadataField.where(name: %w(birth_location deportation_location return_location)).each{|m| m.update_attributes(use_in_map_search: true)}
  end
end
