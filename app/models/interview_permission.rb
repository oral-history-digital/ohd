class InterviewPermission < ApplicationRecord
  belongs_to :interview
  belongs_to :user
end
