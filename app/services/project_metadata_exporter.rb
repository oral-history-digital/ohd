class ProjectMetadataExporter
  def initialize(project)
    @project = project
    @md = ProjectMetadata.new
  end

  def build
    # Header
    @md.self_link = self_url
    @md.creation_date = Date.today

    # Resources
    @md.metadata_resources = @project.interviews.order(:archive_id).pluck(:archive_id)

    # Components
    @md.documentation_url = @project.domain
    @md.documentation_languages = @project.available_locales
    @md.num_interviews = @project.interviews.count
    @md.name = @project.shortname
    @md.title = @project.name
    @md.id = @project.shortname.downcase
    @md.owner = @project.hosting_institution
    @md.publication_year = @project.created_at.year.to_s  # TODO: Not good
    @md.description = ActionView::Base.full_sanitizer.sanitize(@project.introduction)
    @md.description_lang = I18n.locale.to_s
    @md.media_types = @project.interviews.pluck(:media_type).uniq
    @md.mime_types = mime_types

    @md
  end

  def self_url
    if @project.archive_domain.present?
      "#{@project.archive_domain}/de/project/cmdi_metadata.xml"
    else
      Rails.application.routes.url_helpers.project_cmdi_metadata_url(
        locale: 'de',
        project_id: @project.identifier,
        host: OHD_DOMAIN,
        format: :xml
      )
    end
  end

  def mime_types
    @project.interviews
      .map { |interview| interview.original_content_type.present? ?
        interview.original_content_type :
        interview.media_type == 'video' ? 'video/mp4' : 'audio/x-wav'
      }
      .uniq
  end
end
