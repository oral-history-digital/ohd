class AddPasskeyColumnsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :passkey_required_for_login, :boolean, default: false, null: false
    add_column :users, :changed_to_passkey_at, :datetime
  end
end
