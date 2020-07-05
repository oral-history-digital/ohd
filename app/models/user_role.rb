class UserRole < ApplicationRecord
  belongs_to :role
  belongs_to :user_account
end
