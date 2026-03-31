class CreateHomepageBlocks < ActiveRecord::Migration[8.0]
  def change
    create_table :homepage_blocks do |t|
      t.references :instance_setting, null: false, foreign_key: true
      t.string :code, null: false
      t.integer :position, null: false, default: 0
      t.string :button_primary_target, null: false
      t.string :button_secondary_target
      t.boolean :show_secondary_button, null: false, default: false

      t.timestamps
    end

    add_index :homepage_blocks, [:instance_setting_id, :code], unique: true
  end
end
