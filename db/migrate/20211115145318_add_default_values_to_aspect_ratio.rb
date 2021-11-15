class AddDefaultValuesToAspectRatio < ActiveRecord::Migration[5.2]
  def change
    change_column_default(:projects, :aspect_x, from: nil, to: 16)
    change_column_default(:projects, :aspect_y, from: nil, to: 9)
  end
end
