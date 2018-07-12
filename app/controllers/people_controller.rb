class PeopleController < ApplicationController

  layout 'responsive'

  def create
    @person = Person.create person_params
    respond_to do |format|
      format.json { render json: 'ok' }
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
