class ChangeInterviewDurationToDecimal < ActiveRecord::Migration[8.0]
  def up
    change_column :interviews, :duration, :decimal, precision: 10, scale: 3
  end
  def down
    change_column :interviews, :duration, :integer
  end
end
