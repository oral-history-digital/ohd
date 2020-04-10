class BiographicalEntry < ApplicationRecord

  belongs_to :person, touch: true
  
  translates :text, :start_date, :end_date, fallbacks_for_empty_translations: true, touch: true

  after_save :touch_person
  def touch_person
    person.touch
  end

  searchable do
    string :archive_id, :multiple => true, :stored => true do
      person ? person.interviews.map{|i| i.archive_id } : ''
    end
    string :workflow_state
    string :start_date, :stored => true
    (I18n.available_locales + [:orig]).each do |locale|
      text :"text_#{locale}", stored: true do
        text(locale)
      end
    end
  end
end
