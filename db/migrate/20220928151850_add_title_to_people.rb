class AddTitleToPeople < ActiveRecord::Migration[5.2]
  def change
    add_column :people, :title, :integer
  end
end
