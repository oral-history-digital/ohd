class PeopleController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show, :landing_page_metadata]
  skip_after_action :verify_authorized, only: [:show, :metadata, :cmdi_metadata, :random_featured, :landing_page_metadata]
  skip_after_action :verify_policy_scoped, only: [:show, :metadata, :cmdi_metadata, :random_featured, :landing_page_metadata]

  def new
    authorize Person
    respond_to do |format|
      format.html { render "react/app" }
      format.json { render json: {}, status: :ok }
    end
  end

  def create
    authorize Person
    params[:person][:project_id] = current_project.id
    @person = Person.create person_params

    respond @person
  end

  def update
    @person = Person.find params[:id]
    authorize @person
    @person.update person_params

    respond @person
  end

  def show
    @person = Person.find params[:id]
    authorize @person

    respond @person
  end

  def landing_page_metadata
    @person = Person.find params[:person_id]

    data = {
      id: @person.id,
      type: 'Person',
      registry_references: {},
      use_pseudonym: @person.use_pseudonym
    }

    current_project.metadata_fields
      .includes(:translations)
      .where(display_on_landing_page: true)
      .where(ref_object_type: 'Person').each do |m|
        registry_references = @person.registry_references.
          where(registry_reference_type_id: m.registry_reference_type_id)
        registry_references.each do |rr|
          data[:registry_references][rr.id] = RegistryReferenceSerializer.new(rr)
        end
        data[m.name] = @person.project.available_locales.inject({}) do |mem, locale|
          mem[locale] = registry_references.compact.map do |rr|
            RegistryEntry.find(rr.registry_entry_id).to_s(locale)
          end.join(", ")
          mem
        end
    end

    current_project.metadata_fields
      .includes(:translations)
      .where(display_on_landing_page: true)
      .where(source: 'Person').each do |m|
      data[m.name] = @person.send(m.name)
    end

    respond_to do |format|
      format.json do
        render json: {
          nested_id: @person.id,
          data: data,
          nested_data_type: "people",
          data_type: 'projects',
          id: current_project.id,
        }
      end
    end
  end

  def contributions
    person = Person.find params[:person_id]
    authorize person
    project_id = current_project.id

    contributions = person.contributions_with_interviews(project_id)

    render json: contributions, each_serializer: ContributionWithInterviewSerializer
  end

  def index
    policy_scope Person

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        paginate = false
        cache_key = "#{current_project.shortname}-people-#{cache_key_params}"\
          "-#{Person.count}-#{Person.maximum(:updated_at)}"
        json = Rails.cache.fetch(cache_key) do
          if params[:for_projects]
            data = policy_scope(Person).
              order("person_translations.last_name ASC")
            extra_params = "for_projects_#{current_project.id}"
          elsif params[:contributors_for_interview]
            data = policy_scope(Person).
              where(id: Interview.find(params[:contributors_for_interview]).contributions.pluck(:person_id))
            extra_params = "contributors_for_interview_#{params[:contributors_for_interview]}"
          else
            page = params[:page] || 1
            data = policy_scope(Person).
              where(search_params).order("person_translations.last_name ASC").
              paginate(page: page)
            paginate = true
            extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
          end

          {
            data: data.
              includes(:translations, :project, contributions: {contribution_type: :translations}).
              inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
            nested_data_type: "people",
            data_type: 'projects',
            id: current_project.id,
            extra_params: extra_params,
            page: params[:page] || 1,
            result_pages_count: paginate ? data.total_pages : nil,
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

  def respond person
    respond_to do |format|
      format.json do
        render json: {
          nested_id: person.id,
          data: (params[:with_associations].present? ?
            cache_single(person, serializer_name: 'PersonWithAssociations') :
            cache_single(person)),
          nested_data_type: "people",
          data_type: 'projects',
          id: current_project.id,
        }
      end
    end
  end

  def person_params
    params.require(:person).
      permit(
        'first_name',
        'last_name',
        'middle_names',
        'birth_name',
        'gender',
        'title',
        'date_of_birth',
        'project_id',
        :use_pseudonym,
        translations_attributes: [:locale, :id, :first_name, :last_name,
          :birth_name, :other_first_names, :alias_names, :description,
          :pseudonym_first_name, :pseudonym_last_name
        ],
        events_attributes: [
          :eventable_id, :event_type_id, :start_date, :end_date,
          translations_attributes: [:id, :locale, :display_date]
        ]
    )
  end

  def search_params
    params.permit(
      :first_name,
      :last_name,
      :birth_name,
      :alias_names,
      :pseudonym_first_name,
      :pseudonym_last_name
    ).to_h.select{|k,v| !v.blank? }
  end
end
