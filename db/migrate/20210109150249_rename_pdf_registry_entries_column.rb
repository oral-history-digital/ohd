class RenamePdfRegistryEntriesColumn < ActiveRecord::Migration[5.2]
  def up
    Project.first.update_attributes pdf_registry_entry_codes: Project.first.pdf_registry_entry_codes.map{|code| r = RegistryEntry.find_by_code(code); r && r.id}.compact
    rename_column :projects, :pdf_registry_entry_codes, :pdf_registry_entry_ids
  end
  def down
    Project.first.update_attributes pdf_registry_entry_ids: Project.first.pdf_registry_entry_ids.map{|id| r = RegistryEntry.find(id); r && r.code}.compact
    rename_column :projects, :pdf_registry_entry_ids, :pdf_registry_entry_codes
  end
end
