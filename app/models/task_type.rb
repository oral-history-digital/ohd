class TaskType < ApplicationRecord
  belongs_to :project, touch: true
  has_many :tasks
  translates :label, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations
end
