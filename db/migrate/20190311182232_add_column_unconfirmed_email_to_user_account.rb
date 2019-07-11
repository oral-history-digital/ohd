class AddColumnUnconfirmedEmailToUserAccount < ActiveRecord::Migration[5.2]
  def change
    unless Project.name.to_sym == :mog
      add_column :user_accounts, :unconfirmed_email, :string
    end
  end
end
