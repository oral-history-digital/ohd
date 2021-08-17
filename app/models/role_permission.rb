class RolePermission < ApplicationRecord
  belongs_to :role, touch: true
  belongs_to :permission
end
