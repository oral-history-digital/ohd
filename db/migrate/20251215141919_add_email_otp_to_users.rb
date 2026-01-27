class AddEmailOtpToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :email_otp_secret, :string
    add_column :users, :email_otp_sent_at, :datetime
  end
end
