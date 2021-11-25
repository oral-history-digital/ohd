class AddColumnUseInMetadataImportToMetadataField < ActiveRecord::Migration[5.2]
  def change
    add_column :metadata_fields, :use_in_metadata_import, :boolean, default: false
  end
end
