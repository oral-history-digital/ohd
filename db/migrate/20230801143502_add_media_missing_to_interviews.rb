class AddMediaMissingToInterviews < ActiveRecord::Migration[7.0]
  def change
    add_column :interviews, :media_missing, :boolean, default: false, null: false
  end
end
