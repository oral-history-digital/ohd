class AddEventColumnsToMetadataFields < ActiveRecord::Migration[5.2]
  def change
    add_column :metadata_fields, :event_type_id, :integer
    add_column :metadata_fields, :eventable_type, :string
  end
end
