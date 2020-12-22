class AddIndexOnSegmentsTranslations < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :mog
      add_index :segment_translations, :segment_id
    end 
  end
end
