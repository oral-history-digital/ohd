class TranslateCategories < ActiveRecord::Migration
  def self.up
    # Create globalize2 table.
    Category.create_translation_table! :name => :string

    # Migrate existing data to the translation table.
    execute "INSERT INTO category_translations(category_id, locale, name, created_at, updated_at) SELECT id, 'de', name, NOW(), NOW() FROM categories WHERE name IS NOT NULL"

    # Drop the migrated columns.
    remove_columns :categories, :name
  end

  def self.down
    # Re-create the original columns.
    add_column :categories, :name, :string

    # Migrate data to the original table.
    execute "UPDATE categories c, category_translations ct SET c.name = ct.name WHERE c.id = ct.category_id AND ct.locale = 'de' AND ct.name IS NOT NULL"

    # Drop globalize2 table.
    Category.drop_translation_table!
  end
end
