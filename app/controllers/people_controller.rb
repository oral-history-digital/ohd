class PeopleController < ApplicationController

  layout 'responsive'

  def create
    @person = Person.create person_params
    respond_to do |format|
      format.json { render json: {}, status: :ok }
    end
  end

  def update
    @person = Person.find params[:id]
    @person.update_attributes people_params
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
            data: @people.inject({}){|mem, s| mem[s.id] = ::PersonSerializer.new(s).as_json; mem},
            data_type: 'people',
          }
        end.to_json
        render plain: json
      end
    end
  end

  private

  def people_params
    params.require(:people).
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
