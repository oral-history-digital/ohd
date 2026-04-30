class ChangeAffiliatesColumns < ActiveRecord::Migration[8.0]
  def change
    remove_column :affiliates, :url, :string
    add_column :affiliates, :first_name, :string
    add_column :affiliates, :last_name, :string
  end
end
