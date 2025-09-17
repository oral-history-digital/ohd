class TextsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:show]
  skip_after_action :verify_authorized, only: [:show]
  skip_after_action :verify_policy_scoped, only: [:show]

  before_action :set_text, only: [:update]

  def show
    # Handle both resource routes (/texts/:id) and named routes (/conditions, /privacy_protection, etc.)
    @text_code = params[:id] || params[:code] || action_name
    
    # Find the text record for this project and code
    @text = current_project&.texts&.find_by(code: @text_code)
    @text_content = @text&.text(I18n.locale) || @text&.text(current_project&.default_locale)
    
    respond_to do |format|
      format.html { render layout: 'turbo_application' }
      format.json do
        # Keep JSON for backward compatibility
        render json: {
          text_code: @text_code,
          content: @text_content,
          project: current_project
        }
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
