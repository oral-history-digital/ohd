class PeopleController < ApplicationController

  layout 'responsive'

  def new
    authorize Person
    respond_to do |format|
      format.html { render 'react/app' }
      format.json { render json: {}, status: :ok }
    end
  end

  def create
    authorize Person
    @person = Person.create person_params
    respond_to do |format|
      format.json do
        render json: {
          id: @person.id,
          data_type: 'people',
          data: ::PersonSerializer.new(@person).as_json,
          msg: 'processed'
        }
      end
    end
  end

  def update
    @person = Person.find params[:id]
    authorize @person
    @person.update_attributes person_params
    respond_to do |format|
      format.json do
        render json: {
          id: @person.id,
          data_type: 'people',
          data: ::PersonSerializer.new(@person).as_json,
        }
      end
    end
  end

  def index
    policy_scope(Person)
    respond_to do |format|
      extra_params = params[:contributors_for_interview] ?  "contributors_for_interview_#{params[:contributors_for_interview]}" : nil

      format.json do
        json = Rails.cache.fetch "#{Project.project_id}-people-#{extra_params ? extra_params : 'all'}-#{Person.maximum(:updated_at)}" do
          people = params[:contributors_for_interview] ?
            Interview.find(params[:contributors_for_interview]).contributors :
            Person.all
          people = people.includes(:translations, :histories, :biographical_entries, :registry_references)
          {
            data: people.inject({}){|mem, s| mem[s.id] = Rails.cache.fetch("#{Project.project_id}-person-#{s.id}-#{s.updated_at}"){::PersonSerializer.new(s).as_json}; mem},
            data_type: 'people',
            extra_params: extra_params
          }
        end.to_json
        render plain: json
      end
    end
  end

  def destroy 
    @person = Person.find(params[:id])
    authorize @person
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
