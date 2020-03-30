class AssociateRegistryStuffToMetadataFields < ActiveRecord::Migration[5.2]
  def change
    Project.first.registry_entry_search_facets.each do |facet| 
      facet.registry_entry = RegistryEntry.find_by_code(facet.name)
      facet.save
    end
    Project.first.registry_reference_type_search_facets.each do |facet| 
      facet.registry_reference_type = RegistryReferenceType.find_by_code(facet.name)
      facet.save
    end
  end
end
