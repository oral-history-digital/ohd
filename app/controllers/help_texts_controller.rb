class HelpTextsController < ApplicationController
  skip_before_action :authenticate_user_account!, only: [:index]

  def update
    help_text = HelpText.find params[:id]
    authorize help_text
    help_text.update help_text_params

    render json: help_text
  end

  def index
    policy_scope HelpText

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        help_texts = HelpText.includes(:translations)

        render json: help_texts
      end
    end
  end

  private
    def help_text_params
      params.require(:help_text).permit(
        translations_attributes: [:locale, :id, :text, :url]
      )
    end
end
