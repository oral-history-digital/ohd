class CollectionsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]

  def show
    @collection = Collection.find params[:id]
    authorize @collection

    respond_to do |format|
      format.html do
        render :template => "/react/app"
      end
      format.json do
        render json: data_json(@collection)
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
        translations_attributes: [:locale, :id, :name, :responsibles, :notes, :countries, :homepage, :interviewers]
    )
  end

  def search_params
    params.permit(
      :name
    ).to_h.select{|k,v| !v.blank? }
  end
end
