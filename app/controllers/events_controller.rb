class EventsController < ApplicationController
  skip_before_action :authenticate_user_account!, only: [:index, :show]

  def index
    policy_scope Event

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        person = Person.find(params[:person_id])
        events = person.events.includes(:translations)
        render json: events
      end
    end
  end

  def create
    authorize Event
    event = Event.create(event_params)

    render json: event
  end

  def show
    event = Event.find(params[:id])
    authorize event

    render json: event
  end

  def update
    event = Event.find(params[:id])
    authorize event
    event.update_attributes(event_params)

    render json: event
  end

  def destroy
    event = Event.find(params[:id])
    authorize event
    event.destroy

    render json: event.id, status: :ok
  end

  private
    def event_params
      params.require(:event).permit(
        :start_date,
        :end_date,
        :person_id,
        translations_attributes: [:id, :locale, :display_date]
      )
    end
end
