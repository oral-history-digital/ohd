class InstitutionLitePayloadBuilder < ApplicationService
  def initialize(institution, projects_scope)
    @institution = institution
    @projects_scope = projects_scope
  end

  def perform
    metrics = InstitutionMetricsRepository.new(
      institutions: [@institution],
      projects_scope: @projects_scope
    )

    {
      projects_by_institution: metrics.projects_by_institution,
      interview_counts: metrics.interview_counts,
      project_interview_counts: metrics.project_interview_counts,
      collection_counts: metrics.collection_counts,
      cache_key_suffix: cache_key_suffix
    }
  end

  private

  def cache_key_suffix
    [
      'institution-lite',
      Institution.maximum(:updated_at)&.to_i,
      Project.maximum(:updated_at)&.to_i,
      Interview.maximum(:updated_at)&.to_i,
      Collection.maximum(:updated_at)&.to_i
    ].join('-')
  end
end
