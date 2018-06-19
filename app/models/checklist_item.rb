class ChecklistItem < ActiveRecord::Base

  belongs_to :interview
  belongs_to :user

  scope :checked, -> { where(checked: true) }

  TYPES = %w(data speakers media photos text_materials team)

  validates_uniqueness_of :interview_id, :scope => :item_type
  validates_inclusion_of :item_type, :in => TYPES

  before_save :set_checked_at
  after_save :check_editorial_task_completed

  def current_user=(user)
    write_attribute(:user_id, user.id) if user.is_a?(User)
  end

  private

  def set_checked_at
    if checked
      self.checked_at = Time.now
    end
  end

  def check_editorial_task_completed
    if interview.checklist_items.checked.size == TYPES.size
      editorial_task = interview.tasks.for_workflow('Editorial').first
      if editorial_task.nil?
        raise "Interview #{interview.archive_id} ist nicht f&uuml;r die redaktionelle Abnahme vorgesehen."
      else
        # Complete the editorial task. NB: This removes the interview
        # from the views of interviews to check
        editorial_task.assign_to(self.user)
        editorial_task.start!
        editorial_task.complete!
      end
    end
  end

end
