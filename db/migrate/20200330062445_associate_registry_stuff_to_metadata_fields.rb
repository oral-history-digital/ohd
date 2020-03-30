class AssociateRegistryStuffToMetadataFields < ActiveRecord::Migration[5.2]
  def change
    Project.first.registry_reference_type_search_facets.each do |facet|
      rrt  = RegistryReferenceType.find_by_code(facet.name)
      unless rrt
        re = RegistryEntry.find_by_code(facet.name)
        rrt = RegistryReferenceType.create registry_entry_id: re.id, code: facet.name, children_only: true
      end
      facet.registry_entry = re
      facet.registry_reference_type = rrt
      facet.save
    end
  end
end
