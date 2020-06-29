class AddUserColumnsToUserAccounts < ActiveRecord::Migration[5.2]
  def change
    add_column :user_accounts, :admin, :boolean
    add_column :user_accounts, :first_name, :string
    add_column :user_accounts, :last_name, :string
    add_column :user_accounts, :appellation, :string
    add_column :user_accounts, :job_description, :string
    add_column :user_accounts, :research_intentions, :string
    add_column :user_accounts, :comments, :text
    add_column :user_accounts, :organization, :string
    add_column :user_accounts, :homepage, :string
    add_column :user_accounts, :street, :string
    add_column :user_accounts, :zipcode, :string
    add_column :user_accounts, :city, :string
    add_column :user_accounts, :state, :string
    add_column :user_accounts, :country, :string
    add_column :user_accounts, :tos_agreed_at, :datetime
    add_column :user_accounts, :gender, :string
    add_column :user_accounts, :user_registration_id, :integer
    add_column :user_accounts, :user_account_id, :integer
    add_column :user_accounts, :created_at, :datetime
    add_column :user_accounts, :updated_at, :datetime
  end
end
