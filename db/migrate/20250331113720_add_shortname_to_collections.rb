class AddShortnameToCollections < ActiveRecord::Migration[7.0]
  def change
    add_column :collections, :shortname, :string
  end
end
