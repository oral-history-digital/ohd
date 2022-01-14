class CreateMapSections < ActiveRecord::Migration[5.2]
  def change
    create_table :map_sections do |t|
      t.string :name, null: false
      t.decimal :corner1_lat, precision: 10, scale: 6, null: false
      t.decimal :corner1_lon, precision: 10, scale: 6, null: false
      t.decimal :corner2_lat, precision: 10, scale: 6, null: false
      t.decimal :corner2_lon, precision: 10, scale: 6, null: false
      t.integer :order, default: 0, null: false
      t.belongs_to :project, null: false, index: true, foreign_key: true
    end

    reversible do |dir|
      dir.up do
        MapSection.create_translation_table!(label: :string)
      end

      dir.down do
        MapSection.drop_translation_table!
      end
    end
  end
end
