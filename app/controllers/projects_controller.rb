class ProjectsController < ApplicationController
  skip_before_action :authenticate_user_account!,
    only: [:show, :cmdi_metadata, :archiving_batches_show, :archiving_batches_index, :index,
      :edit_info, :edit_display, :edit_config]
  before_action :set_project,
    only: [:show, :cmdi_metadata, :archiving_batches_show, :archiving_batches_index, :edit_info,
      :edit_display, :edit_config, :edit, :update, :destroy]

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
        json = Rails.cache.fetch "projects-#{extra_params}-#{Project.count}-#{Project.maximum(:updated_at)}" do
          {
            data: projects.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
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

  # GET /projects/1
  def show
    respond_to do |format|
      format.html do
        render :template => "/react/app"
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

  %w(edit_info edit_display edit_config).each do |m|
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
    @project = ProjectCreator.perform(project_params, current_user_account)

    respond @project
  end

  # PATCH/PUT /projects/1
  def update
    @project.update(project_params)

    respond @project
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
    # if a project is updated or destroyed from ohd.de
    def set_project
      @project = current_project || Project.find(params[:id])
      authorize @project
    end

    def respond project
      respond_to do |format|
        format.json do
          render json: {
            data: cache_single(project),
            data_type: 'projects',
            id: project.id,
            reload_data_type: 'accounts',
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
          "archive_id_number_length",
          "domain",
          "archive_domain",
          "doi",
          "cooperation_partner",
          "leader",
          "manager",
          "hosting_institution",
          "contact_email",
          "smtp_server",
          "has_newsletter",
          "has_map",
          "is_catalog",
          "grant_project_access_instantly",
          "display_ohd_link",
          "show_preview_img",
          "workflow_state",
          translations_attributes: [:locale, :name, :id, :introduction, :more_text, :landing_page_text]
      )
    end

    def search_params
      params.permit(:name).to_h
    end
end
