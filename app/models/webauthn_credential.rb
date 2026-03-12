class WebauthnCredential < ApplicationRecord
  belongs_to :user, touch: true
  
  validates :external_id, presence: true, uniqueness: true
  validates :public_key, presence: true
  validates :nickname, presence:  true
end
