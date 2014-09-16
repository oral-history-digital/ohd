class RemoveLocations < ActiveRecord::Migration
  def self.up
    remove_columns :interview_translations, [:birth_location, :deportation_location, :forced_labor_locations, :return_locations, :details_of_origin]
    remove_column :interviews, :country_of_origin
    drop_table :location_references
    drop_table :location_reference_translations
    drop_table :location_segments
  end

  def self.down
    raise ActiveRecord::IrreversibleMigration
  end
end
