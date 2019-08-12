class AddPropertiesToInterviews < ActiveRecord::Migration[5.2]
  def change
    add_column :interviews, :properties, :string
  end
end
