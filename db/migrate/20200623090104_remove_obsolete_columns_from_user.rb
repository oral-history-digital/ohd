class RemoveObsoleteColumnsFromUser < ActiveRecord::Migration[5.2]
  # all columns are empty in zwar
  def self.up
    remove_columns :users, :admin_comments, :status, :data_changed_at, :processed_at
  end
  def self.down
    add_column :users, :admin_comments, :string
    add_column :users, :status, :string
    add_column :users, :data_changed_at, :datetime
    add_column :users, :processed_at, :datetime

  end
end
