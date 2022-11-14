class AddShowPreviewImgToProject < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :show_preview_img, :boolean, default: false
    Project.update_all show_preview_img: true
  end
end
