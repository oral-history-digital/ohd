class AddCampAndCompanieRegistryReferenceTypes < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :zwar
      camp = RegistryEntry.find_by_code "camp"
      companie = RegistryEntry.find_by_code "companie"

      camp_type = RegistryReferenceType.create code: 'camp', registry_entry_id: camp.id
      companie_type = RegistryReferenceType.create code: 'companie', registry_entry_id: companie.id

      RegistryReference.where(registry_entry_id: camp.all_descendants.map(&:ids).flatten).update_all(registry_reference_type_id: camp_type.id)
      RegistryReference.where(registry_entry_id: companie.all_descendants.map(&:ids).flatten).update_all(registry_reference_type_id: companie_type.id)
    end
  end
end
