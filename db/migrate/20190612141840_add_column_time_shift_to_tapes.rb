class AddColumnTimeShiftToTapes < ActiveRecord::Migration[5.2]
  def change
    add_column :tapes, :time_shift, :integer, default: 0
  end
end
