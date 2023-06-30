class AccessConfigsController < ApplicationController
  before_action :set_access_config, only: %i[ update ]

  # PATCH/PUT /access_configes/1
  def update
    authorize @access_config.project
    if @access_config.update(access_config_params)
      respond_to do |format|
        format.json do
          render json: {
            data: cache_single(@access_config.project),
            data_type: 'projects',
            id: @access_config.project.id,
            reload_data_type: 'users',
            reload_id: 'current'
          }
        end
      end
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_access_config
      @access_config = AccessConfig.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def access_config_params
      params.require(:access_config).permit(
        organization_setter: {},
        job_description_setter: {},
        research_intentions_setter: {},
        specification_setter: {},
        tos_agreement_setter: {},
      )
    end
end
