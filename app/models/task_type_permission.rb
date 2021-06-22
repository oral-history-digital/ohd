class TaskTypePermission < ApplicationRecord
  belongs_to :task_type, touch: true
  belongs_to :permission
end
