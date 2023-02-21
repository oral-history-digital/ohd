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

    # Resources
    @md.metadata_resources = @interviews.pluck(:archive_id)

    # Components
    @md.documentation_url = @project.domain
    @md.documentation_languages = @project.available_locales
    @md.creator_name = @project.manager
    @md.creator_email = @project.contact_email
    @md.creator_organisation = @project.institutions.first.name
    @md.creator_website = @project.domain
    @md.num_interviews = @interviews.count
    @md.title = @project.name
    @md.id = id
    @md.owner = @project.institutions.first.name
    @md.publication_year = @project.created_at.year.to_s  # TODO: Not good
    @md.description = description
    @md.description_lang = I18n.locale.to_s
    @md.subject_languages = @interviews.map { |i| i.language.code }.uniq
    @md.media_types = @interviews.pluck(:media_type).uniq + ['text']
    @md.mime_types = mime_types

    @md
  end

  def id
    project_name = @project.shortname.downcase
    batch_str = (@batch || 1).to_s.rjust(3, '0')
    "ohd_#{project_name}_#{batch_str}"
  end

  def description
    text = @project.introduction
    ActionView::Base.full_sanitizer.sanitize(text)
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
