class TextsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:show]
  skip_after_action :verify_authorized, only: [:show]
  skip_after_action :verify_policy_scoped, only: [:show]

  before_action :set_text, only: [:update]

  %w(conditions ohd_conditions privacy_protection contact legal_info).each do |page|
    define_method(page) do
      @component = 'TextPage'
      @code = page
      respond_to do |format|
        format.html { render :page }
      end
    end
  end

  # POST /texts
  def create
    authorize current_project, :update?
    @text = Text.create(text_params)

    respond_to do |format|
      format.json do
        render json: {
          data: cache_single(@text.project),
          data_type: 'projects',
          id: @text.project_id,
        }
      end
    end
  end

  def update
    authorize @text.project, :update?
    if @text.update(text_params)
      respond_to do |format|
        format.json do
          render json: {
            data: cache_single(@text.project),
            data_type: 'projects',
            id: @text.project_id,
          }
        end
      end
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_text
      @text = Text.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def text_params
      params.require(:text).permit(
        :code,
        :project_id,
        translations_attributes: [:locale, :text, :id]
      )
    end
end
