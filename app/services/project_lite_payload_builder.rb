class ProjectLitePayloadBuilder < ApplicationService
  def initialize(project)
    @project = project
  end

  def perform
    metrics = ProjectMetricsRepository.new([@project.id])
    updates = metrics.latest_updates_for_project(@project.id)

    {
      interview_counts: metrics.interview_counts_by_project,
      collection_counts: metrics.collection_counts_by_project,
      media_types_by_project: metrics.media_types_by_project,
      interview_languages_by_project: metrics.interview_languages_by_project,
      interview_year_ranges_by_project: metrics.interview_year_ranges_by_project,
      birth_year_ranges_by_project: metrics.birth_year_ranges_by_project,
      cache_key_suffix: build_cache_key_suffix(updates)
    }
  end

  private

  def build_cache_key_suffix(updates)
    [
      'project-lite',
      updates[:interview_updated_at]&.to_i,
      updates[:collection_updated_at]&.to_i,
      updates[:interview_language_updated_at]&.to_i,
      updates[:sponsor_updated_at]&.to_i
    ].join('-')
  end
end
