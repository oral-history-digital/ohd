class AddColumnGrantAccessWithoutLoginToProject < ActiveRecord::Migration[7.0]
  def change
    add_column :projects, :grant_access_without_login, :boolean, default: false
  end
end
