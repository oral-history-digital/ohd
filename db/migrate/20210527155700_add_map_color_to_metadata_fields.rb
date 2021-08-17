class AddMapColorToMetadataFields < ActiveRecord::Migration[5.2]
  def change
    add_column :metadata_fields, :map_color, :string, default: '#1c2d8f'
  end
end
