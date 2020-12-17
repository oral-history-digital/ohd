class OrganizePersonRegistryEntries < ActiveRecord::Migration[5.2]
  def up
    if Project.current.identifier.to_sym == :zwar
      person = RegistryEntry.find(28170)  
      other = RegistryEntry.create code: 'other', desc: 'other people', workflow_state: "public", list_priority: true

      name = RegistryName.create registry_entry_id: other.id, registry_name_type_id: 4, name_position: 0, descriptor: 'Sonstige', locale: :de
      name.update_attributes descriptor: 'Sonstige', locale: :ru
      name.update_attributes descriptor: 'Sonstige', locale: :en

      RegistryHierarchy.create(ancestor_id: person.id, descendant_id: other.id)

      #alphaUp = *('a'..'z')
      #alphaRegistryEntryCodes = alphaUp.map{|x| x + 'a'} | alphaUp.map{|x| x + 'm'}

      alphaRegistryEntryCodes = *('a'..'z')
      alphaRegistryEntryCodes.sort.each_with_index do |start, index|

        stop = alphaRegistryEntryCodes[index+1] || '—'

        alphaRegistryEntry = RegistryEntry.create code: start, desc: start, workflow_state: "public", list_priority: true

        name = RegistryName.create registry_entry_id: alphaRegistryEntry.id, registry_name_type_id: 4, name_position: 0, descriptor: start, locale: :de
        name.update_attributes descriptor: start, locale: :ru
        name.update_attributes descriptor: start, locale: :en

        RegistryHierarchy.create(ancestor_id: other.id, descendant_id: alphaRegistryEntry.id)

        children_ids = person.children.
          includes(registry_names: :translations).
          joins(registry_names: :translations).
          where.not(id: [28171, 28172, 28173]).   # exclude child-nodes Beteiligte, Historische Personen, Zwangsarbeiter/-in
          where("registry_name_translations.locale": :de).   # use only german to sort
          where("registry_names.registry_name_type_id": 1).  # only last-name
          #where("LOWER(registry_name_translations.descriptor) >= '#{start}' COLLATE utf8mb4_unicode_ci").
          #where("LOWER(registry_name_translations.descriptor) < '#{stop}' COLLATE utf8mb4_unicode_ci").map(&:id)
          where("LOWER(registry_name_translations.descriptor) >= '#{start}' COLLATE utf8mb4_general_ci").
          where("LOWER(registry_name_translations.descriptor) < '#{stop}' COLLATE utf8mb4_general_ci").map(&:id)
          #where("LOWER(registry_name_translations.descriptor) >= '#{start}' COLLATE utf8_general_ci").
          #where("LOWER(registry_name_translations.descriptor) < '#{stop}' COLLATE utf8_general_ci").map(&:id)

        RegistryHierarchy.where(descendant_id: children_ids).
          where(ancestor_id: person.id).
          update_all(ancestor_id: alphaRegistryEntry.id)

        RegistryEntry.update_counters alphaRegistryEntry.id, children_count: alphaRegistryEntry.children.count
      end
      person.update_attributes children_count: person.children.count
    end
  end

  def down
  end
end


