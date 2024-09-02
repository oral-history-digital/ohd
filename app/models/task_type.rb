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
      sql = <<-END_SQL
        INSERT INTO tasks (interview_id, task_type_id, workflow_state, created_at, updated_at)
        VALUES #{project.interviews.map {|i| "(#{i.id},#{self.id},'created','#{Time.now.strftime("%Y-%m-%d %H:%M:%S")}','#{Time.now.strftime("%Y-%m-%d %H:%M:%S")}')" }.join(",")}
      END_SQL
      project.interviews.count > 0 && ActiveRecord::Base.connection.execute(sql)
      project.interviews.update_all(updated_at: Time.now)
    end
  end

  after_update :touch_tasks
  def touch_tasks
    tasks.update_all(updated_at: Time.now)
  end
end
