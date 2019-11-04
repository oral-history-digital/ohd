class UpdateSegmentLocales < ActiveRecord::Migration[5.2]
  def change
    reversible do |dir|
      dir.up do
        execute "UPDATE segment_translations SET locale = CONCAT(locale, '-original');"
        remove_column :segment_translations, :spec
      end
    end
  end
end
