class BiographicalEntry < ApplicationRecord
  include Workflow

  belongs_to :person, touch: true
  
  translates :text, :start_date, :end_date

  workflow do
    state :unshared do
      event :publish, transition_to: :public
    end
    state :public do
      event :unpublish, transitions_to: :unshared
    end
  end

  def workflow_state=(change)
    self.send("#{change}!")
  end

end
