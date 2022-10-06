class Event < ApplicationRecord
  belongs_to :person, touch: true
  belongs_to :event_type

  translates :display_date, fallbacks_for_empty_translations: true, touch: true

  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :display_date, length: { maximum: 100 }, allow_blank: true
  validates :person, presence: true
  validates :event_type, presence: true
  validate :end_date_after_start_date

  def single_day?
    start_date == end_date
  end

  def period?
    !single_day?
  end

  def duration
    difference = (end_date - start_date).to_i
    difference + 1
  end

  private

  def end_date_after_start_date
    if end_date < start_date
      errors.add(:end_date, 'must be at or after start date')
    end
  end
end
