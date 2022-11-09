class Event < ApplicationRecord
  belongs_to :event_type
  belongs_to :eventable, polymorphic: true, touch: true

  translates :display_date, fallbacks_for_empty_translations: true, touch: true
  accepts_nested_attributes_for :translations

  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :display_date, length: { maximum: 100 }, allow_blank: true
  validates :eventable, presence: true
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
    if start_date.blank? || end_date.blank?
      return
    end

    if end_date < start_date
      errors.add(:end_date, 'must be at or after start date')
    end
  end
end
