class RmDedaloColumns < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :mog
      #remove_column :histories, :person_dedalo_id
      
      #remove_index :history_translations, :person_dedalo_id
      remove_column :history_translations, :person_dedalo_id

      remove_index :people, :person_dedalo_id
      remove_column :people, :person_dedalo_id

      remove_index :person_translations, :person_dedalo_id
      remove_column :person_translations, :person_dedalo_id

      remove_index :photo_translations, :photo_dedalo_id
      remove_column :photo_translations, :photo_dedalo_id

      remove_index :photos, :photo_dedalo_id
      remove_column :photos, :photo_dedalo_id
      
      remove_index :registry_entries, :entry_dedalo_code
      remove_column :registry_entries, :entry_dedalo_code
      
      remove_index :registry_names, :registry_entry_dedalo_id
      remove_column :registry_names, :registry_entry_dedalo_id
      remove_column :registry_names, :registry_name_type_dedalo_id
      
      remove_index :registry_references, :dedalo_rsc167_section_id
      remove_column :registry_references, :dedalo_rsc167_section_id
      remove_column :registry_references, :registry_entry_dedalo_id
    end
  end
end
