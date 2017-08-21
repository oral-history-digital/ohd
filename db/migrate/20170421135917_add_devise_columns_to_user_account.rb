class AddDeviseColumnsToUserAccount < ActiveRecord::Migration[5.0]
  def change
  unless Project.name.to_sym == :eog
    add_column :user_accounts, :reset_password_sent_at, :datetime
  end
  end
end
