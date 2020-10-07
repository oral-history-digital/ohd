class TaskType < ApplicationRecord
  belongs_to :project, touch: true
  has_many :tasks
  has_many :task_type_permissions, dependent: :destroy
  has_many :permissions, through: :task_type_permissions

  translates :label, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations
end
