class AddColumnChangedToOtpAtToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :changed_to_otp_at, :datetime
  end
end
