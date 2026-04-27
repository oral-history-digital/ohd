class TranslateHomepageBlocks < ActiveRecord::Migration[8.0]
  def change
    reversible do |dir|
      dir.up do
        HomepageBlock.create_translation_table!(
          heading: :string,
          text: :text,
          button_primary_label: :string,
          button_secondary_label: :string,
          image_alt: :string
        )
      end

      dir.down do
        HomepageBlock.drop_translation_table!
      end
    end
  end
end
