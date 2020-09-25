# FIXME: remove after migration 20200624144556 is merged
class User < ApplicationRecord
  belongs_to :role
  belongs_to :user_account
end
