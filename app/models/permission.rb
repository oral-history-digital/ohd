class Permission < ApplicationRecord

  has_many :role_permissions, dependent: :destroy
  has_many :roles,
    through: :role_permissions

  has_many :task_type_permissions, dependent: :destroy
  has_many :task_types,
    through: :task_type_permissions

end
