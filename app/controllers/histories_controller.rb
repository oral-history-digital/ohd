class HistoriesController < ApplicationController

  def create
    @history = History.create(history_params)
    clear_person_cache @history.person

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'people',
          id: @history.person_id,
          nested_data_type: 'histories',
          nested_id: @history.id,
          data: ::HistorySerializer.new(@history).as_json
        }
      end
    end
  end

  def update
    @history = History.find(params[:id])
    updated_at = @history.updated_at
    @history.update_attributes(history_params)
    clear_person_cache @history.person
    clear_history_cache @history.id, updated_at

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'people',
          id: @history.person_id,
          nested_data_type: 'histories',
          nested_id: @history.id,
          data: ::HistorySerializer.new(@history).as_json
        }
      end
    end
  end

  def destroy 
    @history = History.find(params[:id])
    person = @history.person 
    @history.destroy
    clear_person_cache person

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def history_params
    params.require(:history).permit(:person_id, :forced_labor_details, :return_date, :deportation_date, :punishment, :liberation_date)
  end

  def clear_person_cache(person)
    Rails.cache.delete "person-#{person.id}-#{person.updated_at}"
  end

  def clear_history_cache id, updated_at
    Rails.cache.delete "history-#{id}-#{updated_at}"
  end

end
