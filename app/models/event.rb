class Event < ApplicationRecord
  belongs_to :person, touch: true
  belongs_to :event_type

  translates :display_date, fallbacks_for_empty_translations: true, touch: true

  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :display_date, length: { maximum: 100 }, allow_blank: true
  validates :person, presence: true
  validates :event_type, presence: true
end
