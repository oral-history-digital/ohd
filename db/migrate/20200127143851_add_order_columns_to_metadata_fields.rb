class AddOrderColumnsToMetadataFields < ActiveRecord::Migration[5.2]
  def change
    add_column :metadata_fields, :list_columns_order, :float, default: 1.0
    add_column :metadata_fields, :facet_order, :float, default: 1.0
  end
end
