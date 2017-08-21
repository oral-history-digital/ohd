class TranslateLocationReferences < ActiveRecord::Migration
  def self.up
  unless Project.name.to_sym == :eog
    # Create globalize2 table.
    LocationReference.create_translation_table! :name => :string, :location_name => :string, :region_name => :string, :country_name => :string

    # Migrate existing data to the translation table.
    execute "INSERT INTO location_reference_translations(location_reference_id, locale, name, location_name, region_name, country_name, created_at, updated_at) SELECT id, 'de', name, location_name, region_name, country_name, NOW(), NOW() FROM location_references WHERE name IS NOT NULL OR location_name IS NOT NULL or region_name IS NOT NULL or country_name IS NOT NULL"

    # Drop the migrated columns.
    remove_columns :location_references, :name, :location_name, :region_name, :country_name
  end
  end

  def self.down
  unless Project.name.to_sym == :eog
    # Re-create the original columns.
    add_column :location_references, :name, :string
    add_column :location_references, :location_name, :string
    add_column :location_references, :region_name, :string
    add_column :location_references, :country_name, :string

    # Migrate data to the original table.
    execute "UPDATE location_references lr, location_reference_translations lrt SET lr.name = lrt.name WHERE lr.id = lrt.location_reference_id AND lrt.locale = 'de' AND lrt.name IS NOT NULL"
    execute "UPDATE location_references lr, location_reference_translations lrt SET lr.location_name = lrt.location_name WHERE lr.id = lrt.location_reference_id AND lrt.locale = 'de' AND lrt.location_name IS NOT NULL"
    execute "UPDATE location_references lr, location_reference_translations lrt SET lr.region_name = lrt.region_name WHERE lr.id = lrt.location_reference_id AND lrt.locale = 'de' AND lrt.region_name IS NOT NULL"
    execute "UPDATE location_references lr, location_reference_translations lrt SET lr.country_name = lrt.country_name WHERE lr.id = lrt.location_reference_id AND lrt.locale = 'de' AND lrt.country_name IS NOT NULL"

    # Drop globalize2 table.
    LocationReference.drop_translation_table!
  end
  end
end
