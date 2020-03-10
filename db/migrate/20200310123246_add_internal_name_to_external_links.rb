class AddInternalNameToExternalLinks < ActiveRecord::Migration[5.2]
  def change
    add_column :external_links, :internal_name, :string
  end
end
