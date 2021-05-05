class ChangeTaskTypePermissions < ActiveRecord::Migration[5.2]
  def up
    TaskType.where(key: %w(
      transcript
      translation_transcript
      metadata
      translation_metadata
      photos
      translation_photos
      biography
      translation_biography
      table_of_contents
      translation_table_of_contents
      annotations
      anonymisation
    )).each do |task_type|
      task_type.permissions.where(klass: 'Interview', action_name: 'update').update_all(action_name: 'show')
    end
  end
end
