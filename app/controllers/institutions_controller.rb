class InstitutionsController < ApplicationController
  before_action :set_institution, only: [:show, :edit, :update, :destroy]

  # GET /institutions
  def index
    @institutions = Institution.all
  end

  # GET /institutions/1
  def show
  end

  # GET /institutions/new
  def new
    @institution = Institution.new
  end

  # GET /institutions/1/edit
  def edit
  end

  # POST /institutions
  def create
    @institution = Institution.new(institution_params)

    if @institution.save
      redirect_to @institution, notice: 'Institution was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /institutions/1
  def update
    if @institution.update(institution_params)
      redirect_to @institution, notice: 'Institution was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /institutions/1
  def destroy
    @institution.destroy
    redirect_to institutions_url, notice: 'Institution was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_institution
      @institution = Institution.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def institution_params
      params.require(:institution).permit(:name, :shortname, :description, :street, :zip, :city, :country, :latitude, :longitude, :isil, :gnd, :logo, :website)
    end
end
