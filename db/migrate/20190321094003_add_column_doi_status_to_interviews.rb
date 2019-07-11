class AddColumnDoiStatusToInterviews < ActiveRecord::Migration[5.2]
  def change
    add_column :interviews, :doi_status, :string
  end
end
