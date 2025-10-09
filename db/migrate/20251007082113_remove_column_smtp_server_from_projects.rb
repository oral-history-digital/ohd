class RemoveColumnSmtpServerFromProjects < ActiveRecord::Migration[8.0]
  def change
    remove_column :projects, :smtp_server, :string
  end
end
