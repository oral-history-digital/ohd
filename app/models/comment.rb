class Comment < ApplicationRecord
  belongs_to :author, class_name: 'UserAccount'
  belongs_to :receiver, class_name: 'UserAccount'
  belongs_to :ref, polymorphic: true, touch: true

  validates_associated :ref

  def interview_id
    ref.interview_id
  end
end
