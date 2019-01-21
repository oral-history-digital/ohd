class ChangeTasksColumnAuthorizedIdToString < ActiveRecord::Migration[5.2]
  def change
    change_column :tasks, :authorized_id, :string
  end
end
