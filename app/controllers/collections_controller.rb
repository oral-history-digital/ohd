class CollectionsController < ApplicationController
  skip_before_action :authenticate_user!, only: :index

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
    policy_scope(Collection)

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        paginate = false
        json = Rails.cache.fetch "#{current_project.shortname}-collections-#{cache_key_params}-#{Collection.count}-#{Collection.maximum(:updated_at)}" do
          if params[:for_projects]
            data = policy_scope(Collection).
              includes(:translations).
              order("collection_translations.name ASC")
            extra_params = "for_projects_#{current_project.id}"
          else
            page = params[:page] || 1
            data = policy_scope(Collection).
              includes(:translations).
              where(search_params).
              order("collection_translations.name ASC").
              paginate(page: page)
            paginate = true
            extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
          end
          
          {
            data: data.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
            nested_data_type: "collections",
            data_type: 'projects',
            id: current_project.id,
            extra_params: extra_params,
            page: params[:page] || 1,
            result_pages_count: paginate ? data.total_pages : nil
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
        translations_attributes: [:locale, :id, :name, :responsibles, :notes, :countries, :homepage, :interviewers]
    )
  end

  def search_params
    params.permit(
      :name
    ).to_h.select{|k,v| !v.blank? }
  end
end
