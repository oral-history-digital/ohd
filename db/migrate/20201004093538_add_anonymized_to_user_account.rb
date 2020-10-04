class AddAnonymizedToUserAccount < ActiveRecord::Migration[5.2]
  def change
    add_column :user_accounts, :anonymized, :boolean, default: false
  end
end
