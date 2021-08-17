class TranslatePhotoColumns < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        Photo.add_translation_fields! date: :string
        Photo.add_translation_fields! place: :string
        Photo.add_translation_fields! photographer: :string
        Photo.add_translation_fields! license: :string
        remove_column :photos, :date
        remove_column :photos, :place
        remove_column :photos, :photographer
        remove_column :photos, :license
      end

      dir.down do
        remove_column :photo_translations, :date
        remove_column :photo_translations, :place
        remove_column :photo_translations, :photographer
        remove_column :photo_translations, :license
        add_column :photos, :date, :string
        add_column :photos, :place, :string
        add_column :photos, :photographer, :string
        add_column :photos, :license, :string
      end
    end
  end
end
