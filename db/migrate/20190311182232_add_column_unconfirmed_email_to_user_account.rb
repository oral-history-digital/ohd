class AddColumnUnconfirmedEmailToUserAccount < ActiveRecord::Migration[5.2]
  def change
    add_column :user_accounts, :unconfirmed_email, :string
  end
end
