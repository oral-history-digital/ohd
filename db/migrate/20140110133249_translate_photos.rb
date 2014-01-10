class TranslatePhotos < ActiveRecord::Migration
  def self.up
    # Create globalize2 table.
    Photo.create_translation_table! :caption => :text

    # Migrate existing data to the translation table.
    execute "INSERT INTO photo_translations(photo_id, locale, caption, created_at, updated_at)
             SELECT id, 'de', caption, NOW(), NOW() FROM photos
             WHERE caption IS NOT NULL"

    # Drop obsolete column.
    remove_columns :photos, :caption
  end

  def self.down
    # Re-create migrated columns.
    add_column :photos, :caption, :text

    # Migrate data to the original table.
    execute "UPDATE photos p, photo_translations pt SET p.caption = pt.caption WHERE p.id = pt.photo_id AND pt.locale = 'de' AND pt.caption IS NOT NULL"

    # Drop globalize2 table.
    Photo.drop_translation_table!
  end
end
