class RenameColumnEntryCodeToCode < ActiveRecord::Migration[5.2]
  def change
    rename_column :registry_entries, :entry_code, :code
    rename_column :registry_entries, :entry_desc, :desc
  end
end
