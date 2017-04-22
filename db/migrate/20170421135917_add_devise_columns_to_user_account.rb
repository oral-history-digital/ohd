class AddDeviseColumnsToUserAccount < ActiveRecord::Migration[5.0]
  def change
    add_column :user_accounts, :reset_password_sent_at, :datetime
  end
end
