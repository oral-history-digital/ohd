class Event < ApplicationRecord
  include RefreshesSearchIndex
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

  searchable auto_index: false, auto_remove: false do
    date_range :start_date, as: :start_date_dr do
      start_date..end_date
    end
  end

  refresh_search_index_on :start_date, :end_date, :event_type_id, :eventable_type, :eventable_id

  # Refreshes the date range and interviews associated with either event owner.
  #
  # @return [Hash{String => Array<Integer>}] Event and affected interview documents
  def search_index_targets
    old_type = saved_change_to_eventable_type&.first || eventable_type
    old_id = saved_change_to_eventable_id&.first || eventable_id
    interview_ids = [[eventable_type, eventable_id], [old_type, old_id]].flat_map do |type, owner_id|
      case type
      when 'Person' then Contribution.where(person_id: owner_id).pluck(:interview_id)
      when 'Interview' then [owner_id]
      else []
      end
    end
    { 'Event' => [id], 'Interview' => interview_ids }
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
