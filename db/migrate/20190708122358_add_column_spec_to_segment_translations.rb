class AddColumnSpecToSegmentTranslations < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        Segment.add_translation_fields! spec: {type: :string, default: 'original'}
      end

      dir.down do
        remove_column :segment_translations, :spec
      end
    end
  end
end
