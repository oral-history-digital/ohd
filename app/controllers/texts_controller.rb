class TextsController < ApplicationController
  before_action :set_text, only: [:show, :edit, :update, :destroy]

  # POST /texts
  def create
    authorize Text
    @text = Text.create(text_params)

    respond_to do |format|
      format.json do
        render json: data_json(@text, msg: 'processed')
      end
    end
  end

  # PATCH/PUT /texts/1
  def update
    @text.update(text_params)

    respond_to do |format|
      format.json do
        render json: data_json(@text)
      end
    end
  end

  # DELETE /texts/1
  def destroy
    @text.destroy

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
    def set_text
      @text = Text.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def text_params
      params.require(:text).permit(:name, :project_id, :text)
    end
end
