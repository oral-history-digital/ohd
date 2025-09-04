class CreateMaterials < ActiveRecord::Migration[7.0]
  def change
    create_table :materials do |t|
      t.references :attachable, polymorphic: true
      t.string :workflow_state, null: false, default: "unshared"

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        Material.create_translation_table! title: :string, description: :text
      end

      dir.down do
        Material.drop_translation_table!
      end
    end
  end
end
