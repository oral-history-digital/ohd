class UserRole < ApplicationRecord
  belongs_to :role
  belongs_to :user, touch: true
  validates :role_id, presence: true, uniqueness: { scope: :user_id }
end
