class CollectionMetricsRepository
  WORKFLOW_STATES = %w(public restricted unshared).freeze

  def initialize(collection_id)
    @collection_id = collection_id
  end

  def interview_counts
    counts = interviews_scope.group(:workflow_state).count

    {
      public: counts.fetch('public', 0),
      restricted: counts.fetch('restricted', 0),
      unshared: counts.fetch('unshared', 0),
      total: WORKFLOW_STATES.sum { |state| counts.fetch(state, 0) }
    }
  end

  def media_counts
    {
      videos: interviews_scope.where(media_type: 'video').count,
      audios: interviews_scope.where(media_type: 'audio').count
    }
  end

  def interview_language_codes
    InterviewLanguage
      .joins(:interview, :language)
      .where(interviews: { collection_id: @collection_id, workflow_state: WORKFLOW_STATES })
      .distinct
      .pluck('languages.code')
      .compact
      .sort
  end

  def interview_year_range
    rows = interviews_scope.pluck(:interview_date)
    range_from_date_strings(rows)
  end

  def birth_year_range
    rows = Contribution
      .joins(:interview, :contribution_type, :person)
      .where(interviews: { collection_id: @collection_id, workflow_state: WORKFLOW_STATES })
      .where(contribution_types: { code: 'interviewee' })
      .pluck('people.date_of_birth')

    range_from_date_strings(rows)
  end

  def interview_dates
    interviews_scope
      .pluck(:interview_date)
      .map { |value| parse_or_keep(value) }
      .reject(&:nil?)
      .uniq
  end

  def birthdays
    Contribution
      .joins(:interview, :contribution_type, :person)
      .where(interviews: { collection_id: @collection_id, workflow_state: WORKFLOW_STATES })
      .where(contribution_types: { code: 'interviewee' })
      .pluck('people.date_of_birth')
      .map { |value| parse_or_keep(value) }
      .reject(&:nil?)
      .uniq
  end

  def latest_updates
    {
      interview_updated_at: Interview.where(collection_id: @collection_id).maximum(:updated_at),
      interview_language_updated_at: InterviewLanguage
        .joins(:interview)
        .where(interviews: { collection_id: @collection_id })
        .maximum(:updated_at),
      contribution_updated_at: Contribution
        .joins(:interview)
        .where(interviews: { collection_id: @collection_id })
        .maximum(:updated_at),
      person_updated_at: Person
        .joins(:contributions)
        .joins('INNER JOIN interviews ON interviews.id = contributions.interview_id')
        .where(interviews: { collection_id: @collection_id })
        .maximum(:updated_at)
    }
  end

  private

  def interviews_scope
    @interviews_scope ||= Interview.where(collection_id: @collection_id, workflow_state: WORKFLOW_STATES)
  end

  def range_from_date_strings(values)
    years = values.flat_map { |value| value.to_s.scan(/\d{4}/).map(&:to_i) }
    return { min: nil, max: nil } if years.blank?

    { min: years.min, max: years.max }
  end

  def parse_or_keep(value)
    return nil if value.blank?

    Date.parse(value)
  rescue
    value
  end
end