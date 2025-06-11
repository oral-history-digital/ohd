class CreatePdfs < ActiveRecord::Migration[7.0]
  def change
    create_table :pdfs do |t|
      t.references :attachable, polymorphic: true
      t.string :language, null: false, default: ""
      t.string :workflow_state, null: false, default: "unshared"

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        Pdf.create_translation_table! title: :string
      end

      dir.down do
        Pdf.drop_translation_table!
      end
    end
  end
end
