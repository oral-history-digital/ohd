class ChangeAffiliatesColumns < ActiveRecord::Migration[8.0]
  def up
    remove_column :affiliates, :url, :string if column_exists?(:affiliates, :url)
    add_column :affiliates, :first_name, :string unless column_exists?(:affiliates, :first_name)
    add_column :affiliates, :last_name, :string unless column_exists?(:affiliates, :last_name)
  end

  def down
    remove_column :affiliates, :last_name, :string if column_exists?(:affiliates, :last_name)
    remove_column :affiliates, :first_name, :string if column_exists?(:affiliates, :first_name)
    add_column :affiliates, :url, :string unless column_exists?(:affiliates, :url)
  end
end