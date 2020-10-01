class UserRole < ApplicationRecord
  belongs_to :role
  belongs_to :user_account
  belongs_to :user # FIXME: remove when migration 20200624144556 is merged
end
