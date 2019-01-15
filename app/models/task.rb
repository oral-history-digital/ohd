class Task < ApplicationRecord
  belongs_to :user
  belongs_to :supervisor, class_name: 'User'
  belongs_to :authorized, polymorphic: true
end
