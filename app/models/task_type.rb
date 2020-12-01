class TaskType < ApplicationRecord
  belongs_to :project, touch: true
  has_many :tasks, dependent: :destroy
  has_many :task_type_permissions, dependent: :destroy
  has_many :permissions, through: :task_type_permissions

  translates :label, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  after_create :create_task_for_interviews
  def create_task_for_interviews
    sql = <<-END_SQL
      INSERT INTO tasks (interview_id, task_type_id, workflow_state, created_at, updated_at)
      VALUES #{Interview.all.map {|i| "(#{i.id},#{self.id},'created','#{DateTime.now}','#{DateTime.now}')" }.join(",")}
    END_SQL
    ActiveRecord::Base.connection.execute(sql)
    project.clear_cache('interview')
  end

end
