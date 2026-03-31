class CreateInstanceSettings < ActiveRecord::Migration[8.0]
  def change
    create_table :instance_settings do |t|
      t.string :singleton_key, null: false, default: 'default'
      t.references :umbrella_project, null: false, foreign_key: { to_table: :projects }

      t.timestamps
    end

    add_index :instance_settings, :singleton_key, unique: true
  end
end
