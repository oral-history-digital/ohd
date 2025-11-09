class EventTypesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    policy_scope EventType
    @component = 'EventTypesAdmin'

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        data = current_project.event_types.includes(:translations)
        render json: data
      end
    end
  end

  def create
    authorize EventType
    event_type = EventType.create(event_type_params)

    render json: event_type
  end

  def show
    event_type = EventType.find(params[:id])
    authorize event_type

    render json: event_type
  end

  def update
    event_type = EventType.find(params[:id])
    authorize event_type
    event_type.update_attributes(event_type_params)

    render json: event_type
  end

  def destroy
    event_type = EventType.find(params[:id])
    authorize event_type
    event_type.destroy

    render json: {}, status: :ok
  end

  private
    def event_type_params
      params.require(:event_type).permit(
        :code,
        :project_id,
        translations_attributes: [:id, :locale, :name]
      )
    end
end
