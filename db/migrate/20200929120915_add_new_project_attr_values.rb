class AddNewProjectAttrValues < ActiveRecord::Migration[5.2]
  def up
    Project.first.update_attributes(view_modes: ["grid", "list", "workflow"], upload_types: ["bulk_metadata", "bulk_texts", "bulk_registry_entries"])
  end
  def down
  end
end
