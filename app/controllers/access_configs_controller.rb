class AccessConfigsController < ApplicationController
  before_action :set_access_config, only: %i[ update destroy ]

  # POST /access_configes
  def create
    @access_config = AccessConfig.new(access_config_params)

    if @access_config.save
      redirect_to @access_config, notice: "Project access was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /access_configes/1
  def update
    if @access_config.update(access_config_params)
      redirect_to @access_config, notice: "Project access was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /access_configes/1
  def destroy
    @access_config.destroy
    redirect_to access_configes_url, notice: "Project access was successfully destroyed."
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_access_config
      @access_config = AccessConfig.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def access_config_params
      params.require(:access_config).permit(:organization, :job_description, :research_intentions, :specification, :tos_agreement)
    end
end
