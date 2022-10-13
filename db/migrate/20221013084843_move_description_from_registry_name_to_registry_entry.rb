class MoveDescriptionFromRegistryNameToRegistryEntry < ActiveRecord::Migration[5.2]
  def up
    #RegistryEntry.create_translation_table! notes: :text
    RegistryName::Translation.where.not(notes: nil).each do |rnt|
      RegistryEntry.find(RegistryName.find(rnt.registry_name_id).registry_entry_id).update_attributes(
        locale: rnt.locale,
        notes: rnt.notes
      )
    end
    remove_column :registry_name_translations, :notes
  end

  def down
    RegistryName.add_translation_fields! notes: :text
    RegistryEntry::Translation.where.not(notes: nil).each do |ret|
      ret.registry_entry.registry_names.first.update_attributes(
        locale: ret.locale,
        notes: ret.notes
      )
    end
    RegistryEntry.drop_translation_table!
  end
end
