class ChangeInterviewLinksToText < ActiveRecord::Migration[8.0]
  def up
    change_column :interviews, :links, :text
  end

  def down
    change_column :interviews, :links, :string
  end
end
