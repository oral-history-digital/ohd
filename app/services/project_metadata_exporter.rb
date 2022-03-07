class ProjectMetadataExporter
  def initialize(project, batch = nil)
    @project = project
    @batch = batch
    @md = ProjectMetadata.new

    if @batch.present?
      @interviews = @project.archiving_batches
        .where(number: @batch).first
        .interviews.order(:archive_id)
    else
      @interviews = @project.interviews.order(:archive_id)
    end
  end

  def build
    # Header
    @md.creation_date = Date.today
    @md.batch = @batch || 1

    # Resources
    @md.metadata_resources = @interviews.pluck(:archive_id)

    # Components
    @md.documentation_url = @project.domain
    @md.documentation_languages = @project.available_locales
    @md.num_interviews = @interviews.count
    @md.name = @project.shortname
    @md.title = @project.name
    @md.id = @project.shortname.downcase
    @md.owner = @project.institutions.first.name
    @md.publication_year = @project.created_at.year.to_s  # TODO: Not good
    @md.description = ActionView::Base.full_sanitizer.sanitize(@project.introduction)
    @md.description_lang = I18n.locale.to_s
    @md.media_types = @interviews.pluck(:media_type).uniq
    @md.mime_types = mime_types

    @md
  end

  def mime_types
    @interviews
      .map { |interview| interview.original_content_type.present? ?
        interview.original_content_type :
        interview.media_type == 'video' ? 'video/mp4' : 'audio/x-wav'
      }
      .uniq
  end
end
