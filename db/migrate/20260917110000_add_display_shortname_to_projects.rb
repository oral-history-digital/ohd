class AddDisplayShortnameToProjects < ActiveRecord::Migration[8.0]
  def change
    add_column :projects, :display_shortname, :string
  end
end
