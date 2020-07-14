class ChangeInterviewPropertiesToText < ActiveRecord::Migration[5.2]
  def up
    change_column :interviews, :properties, :text
  end
  def down
    change_column :interviews, :properties, :string
  end
end
