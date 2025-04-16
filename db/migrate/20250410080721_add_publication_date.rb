class AddPublicationDate < ActiveRecord::Migration[7.0]
  def change
    add_column :interviews, :publication_date, :string
    add_column :collections, :publication_date, :string
    add_column :projects, :publication_date, :string
  end
end
