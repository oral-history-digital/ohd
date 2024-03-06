class InstitutionsController < ApplicationController
  skip_before_action :authenticate_user!, only: :index
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
