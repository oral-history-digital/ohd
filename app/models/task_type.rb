class TaskType < ApplicationRecord
  belongs_to :project
  has_many :tasks, dependent: :destroy
  has_many :task_type_permissions, dependent: :destroy
  has_many :permissions, through: :task_type_permissions

  translates :label, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  validates :key, presence: true, uniqueness: { scope: :project_id }

  after_create :create_task_for_interviews
  def create_task_for_interviews
    if project.present?
      Task.insert_all!(
        project.interviews.map do |i|
          {
            interview_id: i.id,
            task_type_id: self.id,
            workflow_state: 'created'
          }
        end
      )
      project.interviews.update_all(updated_at: Time.now)
    end
  end

  after_update :touch_tasks
  def touch_tasks
    tasks.update_all(updated_at: Time.now)
  end
end
