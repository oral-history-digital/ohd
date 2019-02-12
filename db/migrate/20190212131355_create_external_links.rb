class CreateExternalLinks < ActiveRecord::Migration[5.2]
  def change
    create_table :external_links do |t|
      t.name :string

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        ExternalLink.create_translation_table! url: :string
      end

      dir.down do
        Post.drop_translation_table!
      end
    end
  end
end
