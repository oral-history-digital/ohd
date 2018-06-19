class WorkflowComment < ActiveRecord::Base

  belongs_to :interview
  belongs_to :user
  belongs_to :parent, :class_name => 'WorkflowComment'

  after_create :update_interview
  after_update :update_interview

  QM_COLORS = [
    '0-red',
    '1-orange',
    '1.5-yellow',
    '2-light_green',
    '3-green'
  ]

  DEFAULT_COLOR_STAMP = '2-not_set'

  def qm_color_stamp
    read_attribute(:qm_color_stamp) || DEFAULT_COLOR_STAMP
  end

  def qm_value
    qm_color_stamp.to_f.to_s
  end

  def qm_color
    qm_color_stamp.split('-').last || 'none'
  end

  private

  def update_interview
    interview.touch
  end

end