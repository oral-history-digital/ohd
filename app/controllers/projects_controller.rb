class ProjectsController < ApplicationController
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  # GET /projects
  def index
    policy_scope(Project)
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "projects-all'-#{Project.maximum(:updated_at)}" do
          {
            data: Project.includes(:translations, metadata_fields: [:translations], external_links: [:translations]).inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            data_type: 'projects'
          }
        end
        render json: json
      end
    end
  end

  # GET /projects/1
  def show
  end

  # GET /projects/new
  def new
    @project = Project.new
    respond_to do |format|
      format.html { render 'react/app' }
      format.json { render json: {}, status: :ok }
    end
  end

  # GET /projects/1/edit
  def edit
  end

  # POST /projects
  def create
    @project = Project.new(project_params)

    respond_to do |format|
      format.json do
        render json: data_json(@project, msg: 'processed')
      end
    end
  end

  # PATCH/PUT /projects/1
  def update
    @project.update(project_params)
    respond_to do |format|
      format.json do
        render json: data_json(@project)
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
    # Use callbacks to share common setup or constraints between actions.
    def set_project
      @project = Project.find(params[:id])
      authorize @project
    end

    # Only allow a trusted parameter "white list" through.
    def project_params
      params.require(:project).
        permit(
          "available_locales",
          "default_locale",
          "view_modes",
          "upload_types",
          "primary_color_rgb",
          "shortname",
          "initials",
          "domain",
          "archive_domain",
          "doi",
          "cooperation_partner",
          "leader",
          "manager",
          "hosting_institution",
          "funder_names",
          "contact_email",
          "smtp_server",
          "has_newsletter",
          "hidden_registry_entry_ids",
          "pdf_registry_entry_codes"
      )
    end
end
