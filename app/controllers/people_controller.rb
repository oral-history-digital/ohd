class PeopleController < ApplicationController

  layout 'responsive'

  def new
    respond_to do |format|
      format.html { render 'react/app' }
      format.json { render json: {}, status: :ok }
    end
  end

  def create
    @person = Person.create person_params
    respond_to do |format|
      format.json do
        render json: {
          id: @person.id,
          data_type: 'people',
          data: ::PersonSerializer.new(@person),
        }
      end
    end
  end

  def update
    @person = Person.find params[:id]
    @person.update_attributes person_params
    respond_to do |format|
      format.json do
        render json: {
          id: @person.id,
          data_type: 'people',
          data: ::PersonSerializer.new(@person),
        }
      end
    end
  end

  def index
    @people = Person.all
    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "people-#{Person.maximum(:updated_at)}" do
          {
            data: @people.inject({}){|mem, s| mem[s.id] = Rails.cache.fetch("person-#{s.id}-#{s.updated_at}"){::PersonSerializer.new(s).as_json}; mem},
            data_type: 'people',
          }
        end.to_json
        render plain: json
      end
    end
  end

  def destroy 
    @person = Person.find(params[:id])
    @person.destroy

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.js
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def person_params
    params.require(:person).
      permit(
        'appellation',
        'first_name',
        'last_name',
        'middle_names',
        'birth_name',
        'gender',
        'date_of_birth',
    )
  end
end
