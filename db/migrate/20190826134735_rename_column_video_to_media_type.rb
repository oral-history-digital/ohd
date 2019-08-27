class RenameColumnVideoToMediaType < ActiveRecord::Migration[5.2]
  def change
    add_column :interviews, :media_type, :string
    Interview.where(video: true).update_all media_type: 'video'
    Interview.where(video: false).update_all media_type: 'audio'
    Interview.where(video: nil).update_all media_type: 'audio'
    remove_column :interviews, :video
  end
end
