class AddTrackingColumns < ActiveRecord::Migration[7.0]
  def change
    add_column :projects, :tracking_site_id, :integer
    add_column :users, :do_not_track, :boolean, default: false, null: false
  end
end
