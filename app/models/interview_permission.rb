class InterviewPermission < ApplicationRecord
  belongs_to :interview
  belongs_to :user, touch: true

  validates :interview_id, presence: true
  validates :user_id, presence: true
  validates :user_id, uniqueness: { scope: :interview_id, message: "User already has permission for this interview" }
end
