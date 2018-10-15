class AddEntryCodesToFirstGenerationRegistryEntries < ActiveRecord::Migration[5.2]
  def change

    I18n.locale = :de

    entry_codes = {
      "Ort": "places",
      "Lager": "camps",
      "Firma": "companies",
      "Person": "people",
      "Einsatzbereich": "forced_labor_fields",
      "Gruppe": "forced_labor_groups",
      "Unterbringung / Inhaftierung": "forced_labor_habitations"
    }

    if Project.name.to_sym == :zwar
      RegistryEntry.root_node.children.each do |entry|
        entry.update entry_code: entry_codes[entry.descriptor.to_sym]
      end
    end
  end
end
