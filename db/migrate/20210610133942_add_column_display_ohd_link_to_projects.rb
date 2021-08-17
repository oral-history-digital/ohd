class AddColumnDisplayOhdLinkToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :display_ohd_link, :boolean, default: false
  end
end
