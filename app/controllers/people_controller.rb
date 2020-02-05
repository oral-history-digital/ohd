class PeopleController < ApplicationController
  skip_before_action :authenticate_user_account!, only: :index

  def new
    authorize Person
    respond_to do |format|
      format.html { render "react/app" }
      format.json { render json: {}, status: :ok }
    end
  end

  def create
    authorize Person
    @person = Person.create person_params
    respond_to do |format|
      format.json do
        render json: data_json(@person, msg: "processed")
      end
    end
  end

  def update
    @person = Person.find params[:id]
    authorize @person
    @person.update_attributes person_params

    respond_to do |format|
      format.json do
        render json: data_json(@person)
      end
    end
  end

  def index
    policy_scope Person

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-people-#{params}-#{Person.maximum(:updated_at)}" do
          if params.keys.include?("all")
            people = Person.all.
              includes(:translations, :histories, biographical_entries: [:translations], registry_references: {registry_entry: {registry_names: :translations}}).
              order("person_translations.last_name ASC")
            extra_params = "all"
          elsif params[:contributors_for_interview]
            people = Person.
              includes(:translations, :histories, biographical_entries: [:translations], registry_references: {registry_entry: {registry_names: :translations}}).
              where(id: Interview.find(params[:contributors_for_interview]).contributions.map(&:person_id))
            extra_params = "contributors_for_interview_#{params[:contributors_for_interview]}"
          else
            page = params[:page] || 1
            people = Person.
              includes(:translations, :histories, biographical_entries: [:translations], registry_references: {registry_entry: {registry_names: :translations}}).
              where(search_params).order("person_translations.last_name ASC").
              paginate page: page
            extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
          end
          
          {
            data: people.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
            data_type: "people",
            extra_params: extra_params,
            page: params[:page] || 1,
            result_pages_count: people.respond_to?(:total_pages) ? people.total_pages : 1,
          }
        end
        render json: json
      end
    end
  end

  def destroy
    @person = Person.find(params[:id])
    authorize @person
    @person.destroy

    respond_to do |format|
      format.html do
        render :action => "index"
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
        translations_attributes: [:locale, :id, :first_name, :last_name, :birth_name, :other_first_names, :alias_names]
    )
  end

  def search_params
    params.permit(
      :first_name,
      :last_name,
      :birth_name,
      :alias_names
    ).to_h
  end
end
