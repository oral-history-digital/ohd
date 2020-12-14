class AddIndexOnSegments < ActiveRecord::Migration[5.2]
  def change
    if Project.current.identifier.to_sym == :mog
      add_index :segments, :interview_id
      add_index :segments, :media_id
    end
  end
end
