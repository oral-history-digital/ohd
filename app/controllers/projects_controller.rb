class ProjectsController < ApplicationController
  skip_before_action :authenticate_user_account!, only: [:index]
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  # GET /projects
  def index
    #if params[:all]
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
        json = Rails.cache.fetch "projects-#{extra_params}-#{Project.maximum(:updated_at)}" do
          {
            #data: Project.includes(:translations, metadata_fields: [:translations], external_links: [:translations]).inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
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
    authorize Project
    @project = Project.create(project_params)

    respond_to do |format|
      format.json do
        render json: data_json(@project, msg: 'processed')
      end
    end
  end

  # PATCH/PUT /projects/1
  def update
    @project.update(project_params)
    @project.touch

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
          "pdf_registry_entry_codes",
          "is_catalog",
          translations_attributes: [:locale, :name, :id]
      )
    end

    def search_params
      params.permit(:name).to_h
    end
end
