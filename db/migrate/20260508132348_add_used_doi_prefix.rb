class AddUsedDoiPrefix < ActiveRecord::Migration[8.0]
  def change
    add_column :interviews, :used_doi_prefix, :string
    remove_column :projects, :doi, :string
    add_column :projects, :used_doi_prefix, :string
    add_column :projects, :doi_status, :string
    add_column :collections, :used_doi_prefix, :string
    add_column :collections, :doi_status, :string
  end
end
