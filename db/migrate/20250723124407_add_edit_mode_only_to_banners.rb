class AddEditModeOnlyToBanners < ActiveRecord::Migration[8.0]
  def change
    add_column :banners, :edit_mode_only, :boolean, default: false, null: false
  end
end
