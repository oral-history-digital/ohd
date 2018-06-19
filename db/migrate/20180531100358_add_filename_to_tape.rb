class AddFilenameToTape < ActiveRecord::Migration[5.0]
  def change
    add_column :tapes, :filename, :string
  end
end
