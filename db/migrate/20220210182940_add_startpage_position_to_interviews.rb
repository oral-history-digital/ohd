class AddStartpagePositionToInterviews < ActiveRecord::Migration[5.2]
  def change
    add_column :interviews, :startpage_position, :integer
    add_index :interviews, :startpage_position
  end
end
