class InstitutionsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show, :list]
  before_action :set_institution, only: [:show, :edit, :update, :destroy]

  # GET /institutions
  def index
    if params.keys.include?("all")
      institutions = policy_scope(Institution).all
      extra_params = "all"
    else
      page = params[:page] || 1
      institutions = policy_scope(Institution).where(search_params).order("name ASC").paginate page: page
      extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
    end

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        json = Rails.cache.fetch "institutions-#{Institution.count}-#{Institution.maximum(:updated_at)}" do
          {
            data: institutions.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
            data_type: "institutions",
            extra_params: extra_params,
            page: params[:page] || 1,
            result_pages_count: institutions.respond_to?(:total_pages) ? institutions.total_pages : nil,
          }
        end
        render json: json
      end
    end
  end

  # GET /institutions/list
  def list
    authorize Institution, :show?

    scoped_institutions = policy_scope(Institution).order(:id)

    if params.keys.include?('all')
      institutions = scoped_institutions
      page = nil
      extra_params = 'all'
    else
      page = params[:page] || 1
      institutions = scoped_institutions.paginate(page: page)
      extra_params = "page_#{page}"
    end

    institutions = institutions.includes(
      :translations,
      { parent: :translations },
      { children: :translations },
      logos: [file_attachment: :blob]
    )

    visible_projects = policy_scope(Project)
      .includes(
        :translations,
        { institutions: :translations },
        logos: [file_attachment: :blob]
      )

    visible_project_ids = visible_projects.map(&:id)
    institution_ids = institutions.map(&:id)

    projects_by_institution = Hash.new { |hash, key| hash[key] = [] }
    visible_projects.each do |project|
      project.institutions.each do |institution|
        projects_by_institution[institution.id] << project
      end
    end

    interview_counts = Interview
      .joins(project: :institution_projects)
      .where(project_id: visible_project_ids)
      .where(institution_projects: { institution_id: institution_ids })
      .group('institution_projects.institution_id', :workflow_state)
      .count

    collection_counts = Collection
      .where(project_id: visible_project_ids, institution_id: institution_ids)
      .group(:institution_id)
      .count

    cache_key = [
      'institutions-list',
      extra_params,
      projects_cache_scope_key,
      I18n.locale,
      Institution.count,
      Institution.maximum(:updated_at),
      Project.maximum(:updated_at),
      Interview.maximum(:updated_at),
      Collection.maximum(:updated_at)
    ].join('-')

    json = Rails.cache.fetch(cache_key, expires_in: 15.minutes) do
      {
        data: ActiveModelSerializers::SerializableResource.new(
          institutions,
          each_serializer: InstitutionListSerializer,
          projects_by_institution: projects_by_institution,
          interview_counts: interview_counts,
          collection_counts: collection_counts
        ).as_json,
        page: page,
        result_pages_count: institutions.respond_to?(:total_pages) ? institutions.total_pages : nil
      }
    end

    render json: json
  end

  def show
    respond_to do |format|
      format.html do
        render :template => "/react/app"
      end
      format.json do
        render json: data_json(@institution)
      end
    end
  end
  
  # POST /institutions
  def create
    authorize Institution
    @institution = Institution.create(institution_params)

    respond @institution
  end

  # PATCH/PUT /institutions/1
  def update
    @institution.update(institution_params)
    respond @institution
  end

  # DELETE /institutions/1
  def destroy
    @institution.destroy

    respond_to do |format|
      format.html do
        render :action => "index"
      end
      format.js
      format.json { render json: {}, status: :ok }
    end
  end

  private
    def projects_cache_scope_key
      # Avoid cache leaks across visibility contexts (anonymous/admin/per-user).
      return 'anonymous' unless current_user
      return 'admin' if current_user.admin?

      "user-#{current_user.id}"
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_institution
      @institution = Institution.find(params[:id])
      authorize @institution
    end

    # Only allow a trusted parameter "white list" through.
    def institution_params
      params.require(:institution).permit(
        :shortname,
        :street,
        :zip,
        :city,
        :country,
        :latitude,
        :longitude,
        :isil,
        :gnd,
        :website,
        :parent_id,
        translations_attributes: [:locale, :id, :name, :description]
      )
    end

    def search_params
      params.permit(
        :name,
        :shortname,
      ).to_h.select{|k,v| !v.blank? }
    end

    def respond institution
      respond_to do |format|
        format.json do
          render json: {
            data: cache_single(institution),
            data_type: 'institutions',
            id: institution.id,
          }
        end
      end
    end

end
