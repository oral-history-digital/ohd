class RemoveTimecodeAndMeddiaIdFromAnnotations < ActiveRecord::Migration[5.0]
  def change
    remove_column :annotations, :timecode
    remove_column :annotations, :media_id
  end
end
