class RenameTextsColumnNameToCode < ActiveRecord::Migration[7.0]
  def change
    rename_column :texts, :name, :code
  end
end
