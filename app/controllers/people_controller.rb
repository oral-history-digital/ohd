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
    @person.update_attributes person_params
    respond_to do |format|
      format.json { render json: @person }
    end
  end

  private

  def people_params
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
