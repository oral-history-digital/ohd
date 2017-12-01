class AddFacetEntryCodesToRegistryEntries < ActiveRecord::Migration[5.0]
  def change
    if Project.name == :zwar
      I18n.locale = :de
      RegistryName.joins(:translations).where(descriptor: "Gruppe").first.registry_entry.update_attribute :entry_code, "forced_labor_groups"
      RegistryName.joins(:translations).where(descriptor: "Einsatzbereich").first.registry_entry.update_attribute :entry_code, "forced_labor_fields"
      RegistryName.joins(:translations).where(descriptor: "Unterbringung / Inhaftierung").first.registry_entry.update_attribute :entry_code, "forced_labor_habitations"
    end
  end
end
