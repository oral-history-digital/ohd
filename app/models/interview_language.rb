class InterviewLanguage < ApplicationRecord

  belongs_to :interview, touch: true
  belongs_to :language

end
