class CollectionsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show, :for_project]

  def show
    @collection = Collection.find params[:id]
    authorize @collection

    respond_to do |format|
      format.html do
        render :template => "/react/app"
      end
      format.json do
        if params[:lite].present?
          render json: lite_collection_json(@collection)
        else
          render json: data_json(@collection)
        end
      end
    end
  end

  def new
    authorize Collection
    respond_to do |format|
      format.html { render "react/app" }
      format.json { render json: {}, status: :ok }
    end
  end

  def create
    authorize Collection
    @collection = Collection.create collection_params
    respond @collection
  end

  def update
    @collection = Collection.find params[:id]
    authorize @collection
    @collection.update collection_params

    respond @collection
  end

  def index
    id = nil
    nested_data_type = nil

    if params.keys.include?("all")
      collections = policy_scope(Collection).
        includes(:translations, :institution).all
      data_type = "collections"
      extra_params = "all"
    elsif params[:for_projects]
      collections = policy_scope(Collection).
        includes(:translations, :institution).
        order("collection_translations.name ASC")
      data_type = "projects"
      id = current_project.id
      nested_data_type = "collections"
      extra_params = "for_projects_#{current_project.id}"
    else
      page = params[:page] || 1
      collections = policy_scope(Collection).
        where(search_params).
        includes(:translations, :institution).
        order("collection_translations.name ASC").
        paginate page: page
      data_type = "projects"
      id = current_project.id
      nested_data_type = "collections"
      extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
    end

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        json = Rails.cache.fetch "#{current_project.shortname}-collections-#{extra_params}-#{Collection.count}-#{Collection.maximum(:updated_at)}" do
          {
            data: collections.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
            data_type: data_type,
            nested_data_type: nested_data_type,
            id: id,
            extra_params: extra_params,
            page: params[:page] || 1,
            result_pages_count: collections.respond_to?(:total_pages) ? collections.total_pages : nil,
          }
        end
        render json: json
      end
    end
  end

  # GET /projects/:id/collections
  def for_project
    authorize Project, :show?

    project = policy_scope(Project).find_by(id: params[:id]) ||
      policy_scope(Project).find_by(shortname: params[:id])
    raise ActiveRecord::RecordNotFound if project.blank?

    # The project has already been resolved through policy_scope(Project), so
    # limit collections directly to that authorized project.
    collections_scope = Collection.where(project_id: project.id)

    collections_scope = collections_scope.where(workflow_state: normalized_workflow_states) if normalized_workflow_states

    if params.keys.include?("all")
      collections = collections_scope
        .order(created_at: :desc)
        .includes(:translations, institution: :translations, project: :translations)
      page = nil
      extra_params = 'all'
    else
      page = params[:page] || 1
      collections = collections_scope
        .order(created_at: :desc)
        .includes(:translations, institution: :translations, project: :translations)
        .paginate(page: page)
      extra_params = "page_#{page}"
    end

    interview_counts = Interview
      .where(collection_id: collections.map(&:id))
      .group(:collection_id, :workflow_state)
      .count

    interview_languages_by_collection = interview_languages_by_collection(collections.map(&:id))

    cache_key = [
      'project-collections',
      project.id,
      extra_params,
      projects_cache_scope_key,
      normalized_workflow_states&.join(','),
      I18n.locale,
      Project.maximum(:updated_at),
      Collection.count,
      Collection.maximum(:updated_at),
      Interview.maximum(:updated_at),
      InterviewLanguage.maximum(:updated_at),
      Language.maximum(:updated_at)
    ].join('-')

    json = Rails.cache.fetch(cache_key, expires_in: 15.minutes) do
      {
        data: serialized_project_collections(collections, interview_counts, interview_languages_by_collection),
        project: serialized_project_summary(project),
        page: page,
        result_pages_count: collections.respond_to?(:total_pages) ? collections.total_pages : nil
      }
    end

    render json: json
  end

  def destroy
    @collection = Collection.find(params[:id])
    authorize @collection
    @collection.destroy

    respond_to do |format|
      format.html do
        render :action => "index"
      end
      format.js
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def lite_collection_json(collection)
    payload = CollectionLitePayloadBuilder.perform(collection)

    {
      id: collection.id,
      data_type: 'collections',
      data: cache_single(
        collection,
        serializer_name: 'CollectionLite',
        interviews: payload[:interviews],
        media_types: payload[:media_types],
        interview_year_range: payload[:interview_year_range],
        birth_year_range: payload[:birth_year_range],
        languages_interviews: payload[:languages_interviews],
        cache_key_suffix: payload[:cache_key_suffix]
      )
    }
  end

  def projects_cache_scope_key
    # Avoid cache leaks across visibility contexts (anonymous/admin/per-user).
    return 'anonymous' unless current_user
    return 'admin' if current_user.admin?

    "user-#{current_user.id}"
  end

  def serialized_project_collections(collections, interview_counts, interview_languages_by_collection)
    ActiveModelSerializers::SerializableResource.new(
      collections,
      each_serializer: ProjectCollectionsSerializer,
      interview_counts: interview_counts,
      interview_languages_by_collection: interview_languages_by_collection
    ).as_json
  end

  def serialized_project_summary(project)
    {
      id: project.id,
      shortname: project.shortname,
      name: project.name,
      archive_domain: project.archive_domain.presence
    }
  end

  def interview_languages_by_collection(collection_ids)
    return {} if collection_ids.blank?

    rows = InterviewLanguage
      .joins(:interview, :language)
      .where(interviews: { collection_id: collection_ids, workflow_state: %w(public restricted unshared) })
      .distinct
      .pluck('interviews.collection_id', 'languages.code')

    rows.each_with_object({}) do |(collection_id, language_code), result|
      next if language_code.blank?

      result[collection_id] ||= []
      result[collection_id] << language_code
    end.transform_values { |codes| codes.uniq.sort }
  end

  def respond collection
    respond_to do |format|
      format.json do
        render json: {
          nested_id: collection.id,
          data: cache_single(collection),
          nested_data_type: "collections",
          data_type: 'projects',
          id: current_project.id,
        }
      end
    end
  end

  def collection_params
    params.require(:collection).
      permit(
        'project_id', 
        'institution_id',
        'shortname',
        'publication_date',
        translations_attributes: [:locale, :id, :name, :responsibles, :notes, :countries, :homepage, :interviewers]
    )
  end

  def search_params
    params.permit(
      :name
    ).to_h.select{|k,v| !v.blank? }
  end

  def normalized_workflow_states
    return @normalized_workflow_states if defined?(@normalized_workflow_states)

    value = params[:workflow_state]
    return @normalized_workflow_states = nil if value.blank? || value == 'all'

    states = value.to_s.split(',').map(&:strip).reject(&:blank?)
    allowed_states = %w(public restricted unshared)
    filtered_states = states & allowed_states

    @normalized_workflow_states = filtered_states.presence
  end
end
