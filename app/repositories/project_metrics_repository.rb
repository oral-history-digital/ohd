class ProjectMetricsRepository
  WORKFLOW_STATES = %w(public restricted unshared).freeze

  def initialize(project_ids)
    @project_ids = Array(project_ids).compact
  end

  def interview_counts_by_project
    return {} if @project_ids.blank?

    Interview
      .where(project_id: @project_ids)
      .group(:project_id, :workflow_state)
      .count
  end

  def collection_counts_by_project
    return {} if @project_ids.blank?

    Collection
      .where(project_id: @project_ids)
      .group(:project_id, :workflow_state)
      .count
  end

  def interview_languages_by_project
    return {} if @project_ids.blank?

    rows = InterviewLanguage
      .joins(:interview, :language)
      .where(interviews: { project_id: @project_ids, workflow_state: %w(public restricted unshared) })
      .distinct
      .pluck('interviews.project_id', 'languages.code')

    rows.each_with_object({}) do |(project_id, language_code), result|
      next if language_code.blank?

      result[project_id] ||= []
      result[project_id] << language_code
    end.transform_values { |codes| codes.uniq.sort }
  end

  def interview_year_ranges_by_project
    return {} if @project_ids.blank?

    rows = Interview
      .where(project_id: @project_ids)
      .pluck(:project_id, :interview_date)

    rows.each_with_object({}) do |(project_id, interview_date), result|
      years = interview_date.to_s.scan(/\d{4}/).map(&:to_i)
      next if years.blank?

      range = (result[project_id] ||= { min: nil, max: nil })
      min_year = years.min
      max_year = years.max

      range[:min] = min_year if range[:min].nil? || min_year < range[:min]
      range[:max] = max_year if range[:max].nil? || max_year > range[:max]
    end
  end

  def birth_year_ranges_by_project
    return {} if @project_ids.blank?

    rows = Contribution
      .joins(:interview, :contribution_type, :person)
      .where(interviews: { project_id: @project_ids })
      .where(contribution_types: { code: 'interviewee' })
      .pluck('interviews.project_id', 'people.date_of_birth')

    rows.each_with_object({}) do |(project_id, date_of_birth), result|
      year = date_of_birth.to_s[/\d{4}/]&.to_i
      next if year.blank? || year.zero?

      range = (result[project_id] ||= { min: nil, max: nil })
      range[:min] = year if range[:min].nil? || year < range[:min]
      range[:max] = year if range[:max].nil? || year > range[:max]
    end
  end

  def latest_updates_for_project(project_id)
    {
      interview_updated_at: Interview.where(project_id: project_id).maximum(:updated_at),
      collection_updated_at: Collection.where(project_id: project_id).maximum(:updated_at),
      interview_language_updated_at: InterviewLanguage
        .joins(:interview)
        .where(interviews: { project_id: project_id })
        .maximum(:updated_at),
      sponsor_updated_at: SponsorLogo.where(ref_type: 'Project', ref_id: project_id).maximum(:updated_at)
    }
  end

  def media_types_by_project
    return {} if @project_ids.blank?

    rows = Interview
      .where(project_id: @project_ids, workflow_state: WORKFLOW_STATES)
      .group(:project_id, :media_type)
      .count

    @project_ids.each_with_object({}) do |project_id, result|
      result[project_id] = {
        audio: rows.fetch([project_id, 'audio'], 0),
        video: rows.fetch([project_id, 'video'], 0)
      }
    end
  end
end
