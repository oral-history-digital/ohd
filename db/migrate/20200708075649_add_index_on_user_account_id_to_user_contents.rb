class AddIndexOnUserAccountIdToUserContents < ActiveRecord::Migration[5.2]
  def change
    add_index :user_contents, :user_account_id
  end
end
