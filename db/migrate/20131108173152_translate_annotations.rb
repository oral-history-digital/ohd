class TranslateAnnotations < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :eog
    Annotation.create_translation_table! :text => :text

    # Migrate existing data to the translation table.
    execute "INSERT INTO annotation_translations(annotation_id, locale, text, created_at, updated_at) SELECT id, 'de', text, NOW(), NOW() FROM annotations WHERE text IS NOT NULL"

    # Drop the migrated column.
    remove_columns :annotations, :text
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    # Re-create the original column.
    add_column :annotations, :text, :string

    # Migrate data to the original table.
    execute "UPDATE annotations a, annotation_translations at SET a.text = at.text WHERE a.id = at.annotation_id AND at.locale = 'de' AND at.text IS NOT NULL"

    # Drop globalize2 table.
    Annotation.drop_translation_table!
  end
  end
end
