class ChangePhotoUpdatedAt < ActiveRecord::Migration[5.2]
  def change
    rename_column :photos, :photo_updated_at, :updated_at
  end
end
