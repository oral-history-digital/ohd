class AddColumnNotesToRegistryNameTranslations < ActiveRecord::Migration[5.0]
  def change
    reversible do |dir|
      dir.up do
        RegistryName.add_translation_fields! notes: :text
      end

      dir.down do
        remove_column :registry_name_translations, :notes
      end
    end
  end
end
