class CreateBaseRegistryHierarchyForEog < ActiveRecord::Migration[5.0]
  def change
    if Project.name.to_sym == :mog
      root = RegistryEntry.new entry_code: "root", entry_desc: "root", workflow_state: "public", list_priority: false
      root.save(validate: false)

      name_type = RegistryNameType.create code: "spelling", name: "Bezeichner", order_priority: 1, allows_multiple: false, mandatory: true

      # time, organization, person, center of deprivation of liberty, keyword, nonverbal event, location
      [
        {de: "Zeit", en: "time"},
        {de: "Organisation", en: "organization"},
        {de: "Person", en: "person"},
        {de: "Ort des Freiheitsentzugs", en: "center of deprivation of liberty"},
        {de: "Nichtverbales Ereignis", en: "nonverbal event"},
        {de: "Schlagwort", en: "keyword"},
        {de: "Ort", en: "location"},
      ].each do |entry|
        child_entry = RegistryEntry.new entry_code: entry[:en], entry_desc: entry[:en], workflow_state: "public", list_priority: false
        child_entry.save(validate: false)
        hierarchy = RegistryHierarchy.create ancestor_id: root.id, descendant_id: child_entry.id, direct: true
        name = RegistryName.create registry_entry_id: child_entry.id, registry_name_type_id: name_type.id, name_position: 0, descriptor: entry[:de]
        trans = RegistryName::Translation.create registry_name_id: name.id, locale: 'en', descriptor: entry[:en]
      end
    end
  end
end
