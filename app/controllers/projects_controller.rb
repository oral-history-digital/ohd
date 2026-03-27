class ProjectsController < ApplicationController
  skip_before_action :authenticate_user!,
    only: [:show, :cmdi_metadata, :archiving_batches_show, :archiving_batches_index, :index, :list]
      #:edit_info, :edit_display, :edit_config]
  before_action :set_project,
    only: [:show, :cmdi_metadata, :archiving_batches_show, :archiving_batches_index, :edit_info,
           :edit_display, :edit_config, :edit_access_config, :edit, :update, :destroy] +
           Project.non_public_method_names

  # GET /projects
  def index
    if params.keys.include?('all')
      projects = policy_scope(Project).all
      extra_params = 'all'
    else
      page = params[:page] || 1
      projects = policy_scope(Project).where(search_params).order("created_at DESC").paginate page: page
      extra_params = search_params.update(page: page).inject([]){|mem, (k,v)| mem << "#{k}_#{v}"; mem}.join("_")
    end

    respond_to do |format|
      format.html { render 'react/app' }
      format.json do
        cache_key = [
          'projects',
          extra_params,
          projects_cache_scope_key,
          Project.count,
          Project.maximum(:updated_at)
        ].join('-')

        json = Rails.cache.fetch(cache_key) do
          {
            data: projects.
              includes(:translations, metadata_fields: [
                :translations, registry_reference_type: {registry_entry: {registry_names: :translations}}
              ]).
              inject({}){|mem, s| mem[s.id] = cache_single(s, serializer_name: 'ProjectBase'); mem},
            data_type: 'projects',
            extra_params: extra_params,
            page: params[:page],
            result_pages_count: projects.respond_to?(:total_pages) ? projects.total_pages : nil
          }
        end
        render json: json
      end
    end
  end

  # GET /projects/list
  def list
    # This endpoint is global, so force nil project context and avoid per-request project cache lookup.
    @current_project = nil
    authorize Project, :show?

    scoped_projects = policy_scope(Project)
    scoped_projects = scoped_projects.where(workflow_state: normalized_workflow_states) if normalized_workflow_states

    if params.keys.include?('all')
      projects = scoped_projects.order(created_at: :desc)
      page = nil
      extra_params = 'all'
    else
      page = params[:page] || 1
      projects = scoped_projects.order(created_at: :desc).paginate(page: page)
      extra_params = "page_#{page}"
    end

    projects = projects.includes(
      :translations,
      { institutions: :translations },
      logos: [file_attachment: :blob]
    )

    project_ids = projects.map(&:id)
    metrics = ProjectMetricsRepository.new(project_ids)

    interview_counts = metrics.interview_counts_by_project
    collection_counts = metrics.collection_counts_by_project
    interview_languages_by_project = metrics.interview_languages_by_project

    cache_key = [
      'projects-list',
      extra_params,
      projects_cache_scope_key,
      normalized_workflow_states&.join(','),
      I18n.locale,
      Project.count,
      Project.maximum(:updated_at),
      Interview.maximum(:updated_at),
      Language.maximum(:updated_at),
      Collection.maximum(:updated_at)
    ].join('-')

    json = Rails.cache.fetch(cache_key, expires_in: 15.minutes) do
      {
        data: serialized_projects(projects, interview_counts, collection_counts, interview_languages_by_project),
        page: page,
        result_pages_count: projects.respond_to?(:total_pages) ? projects.total_pages : nil
      }
    end

    render json: json
  end

  # GET /projects/1
  def show
    respond_to do |format|
      format.html do
        render :template => "/react/app"
      end
      format.json do
        if params[:lite].present?
          render json: lite_project_json(@project)
        else
          render json: data_json(@project)
        end
      end
    end
  end

  Project.non_public_method_names.each do |m|
    define_method m do
      respond_to do |format|
        format.json do
          render json: {
            id: @project.id,
            data_type: "projects",
            nested_data_type: m,
            data: @project.send(m),
            page: '1'
          }, status: :ok
        end
      end
    end
  end

  def cmdi_metadata
    respond_to do |format|
      format.xml do
        exporter = ProjectMetadataExporter.new(@project, params[:batch])
        metadata = exporter.build
        render xml: metadata.to_xml
      end
    end
  end

  def archiving_batches_show
    respond_to do |format|
      format.json do
        batch_number = params[:number].to_i
        batch = @project.archiving_batches.where(number: batch_number).first

        if batch.blank?
          not_found
        else
          render json: batch
        end
      end
    end
  end

  def archiving_batches_index
    respond_to do |format|
      format.json do
        batches = @project.archiving_batches.order(:number)
        render json: batches
      end
    end
  end

  %w(edit_info edit_display edit_config edit_access_config).each do |m|
    define_method m do
      respond_to do |format|
        format.html do
          render :template => "/react/app"
        end
      end
    end
  end

  # POST /projects
  def create
    authorize Project
    @project = ProjectCreator.perform(project_params, current_user)

    respond @project
  end

  # PATCH/PUT /projects/1
  def update
    @project.update(project_params)

    respond_to do |format|
      format.json do
        render json: {
          data: cache_single(@project, serializer_name: 'ProjectFull'),
          data_type: 'projects',
          id: @project.id,
        }
      end
    end
  end

  # DELETE /projects/1
  def destroy
    @project.destroy

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.js
      format.json { render json: {}, status: :ok }
    end
  end

  private
    def lite_project_json(project)
      payload = ProjectLitePayloadBuilder.perform(project)

      {
        id: project.id,
        data_type: 'projects',
        data: cache_single(
          project,
          serializer_name: 'ProjectLite',
          interview_counts: payload[:interview_counts],
          collection_counts: payload[:collection_counts],
          media_types_by_project: payload[:media_types_by_project],
          interview_languages_by_project: payload[:interview_languages_by_project],
          interview_year_ranges_by_project: payload[:interview_year_ranges_by_project],
          birth_year_ranges_by_project: payload[:birth_year_ranges_by_project],
          cache_key_suffix: payload[:cache_key_suffix]
        )
      }
    end

    def projects_cache_scope_key
      # Avoid cache leaks across visibility contexts (anonymous/admin/per-user).
      return 'anonymous' unless current_user
      return 'admin' if current_user.admin?

      "user-#{current_user.id}"
    end

    def normalized_workflow_states
      return @normalized_workflow_states if defined?(@normalized_workflow_states)

      value = params[:workflow_state]
      # blank/all means "do not filter by workflow_state".
      return @normalized_workflow_states = nil if value.blank? || value == 'all'

      states = value.to_s.split(',').map(&:strip).reject(&:blank?)
      # Project supports only these workflow states.
      allowed_states = %w(public unshared)
      filtered_states = states & allowed_states

      # Invalid-only input falls back to no filter.
      @normalized_workflow_states = filtered_states.presence
    end

    def serialized_projects(projects, interview_counts, collection_counts, interview_languages_by_project)
      ActiveModelSerializers::SerializableResource.new(
        projects,
        each_serializer: ProjectArchiveSerializer,
        interview_counts: interview_counts,
        collection_counts: collection_counts,
        interview_languages_by_project: interview_languages_by_project
      ).as_json
    end

    # if a project is updated or destroyed from ohd.de
    def set_project
      @project = params[:id] ? Project.find(params[:id]) : current_project
      authorize @project
    end

    def respond project
      respond_to do |format|
        format.json do
          render json: {
            data: cache_single(project),
            data_type: 'projects',
            id: project.id,
            reload_data_type: 'users',
            reload_id: 'current'
          }
        end
      end
    end

    # Only allow a trusted parameter "white list" through.
    def project_params
      params.require(:project).
        permit(
          "pseudo_available_locales",
          "pseudo_view_modes",
          "pseudo_upload_types",
          "pseudo_funder_names",
          "pseudo_logged_out_visible_registry_entry_ids",
          "pseudo_hidden_registry_entry_ids",
          "pseudo_pdf_registry_entry_ids",
          "pseudo_hidden_transcript_registry_entry_ids",
          "fullname_on_landing_page",
          "default_locale",
          "primary_color",
          "secondary_color",
          "editorial_color",
          "aspect_x",
          "aspect_y",
          "shortname",
          "publication_date",
          "archive_id_number_length",
          "domain",
          "doi",
          "cooperation_partner",
          "leader",
          "manager",
          "hosting_institution",
          "contact_email",
          "has_newsletter",
          "has_map",
          "is_catalog",
          "grant_project_access_instantly",
          "grant_access_without_login",
          "display_ohd_link",
          "show_preview_img",
          "show_legend",
          "workflow_state",
          translations_attributes: [
            :locale,
            :name,
            :id,
            :introduction,
            :more_text,
            :landing_page_text,
            :restricted_landing_page_text,
            :media_missing_text
          ]
      )
    end

    def search_params
      params.permit(:name).to_h
    end
end
