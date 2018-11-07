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

  searchable do
    string :archive_id, :multiple => true, :stored => true do
      person.interviews.map{|i| i.archive_id }
    end
    string :start_date, :stored => true
    (Project.available_locales + [:orig]).each do |locale|
      text :"text_#{locale}" do
        text(locale)
      end
    end
  end
end
