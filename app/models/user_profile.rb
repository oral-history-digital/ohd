class UserProfile < ApplicationRecord
  belongs_to :user
  belongs_to :known_language, class_name: 'Language', optional: true
  belongs_to :unknown_language, class_name: 'Language', optional: true

  validates :user_id, presence: true
  validates :user_id, uniqueness: true
end