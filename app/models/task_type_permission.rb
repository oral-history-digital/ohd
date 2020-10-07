class TaskTypePermission < ApplicationRecord
  belongs_to :task_type
  belongs_to :permission
end
