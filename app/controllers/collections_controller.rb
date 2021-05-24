class CollectionsController < ApplicationController
  skip_before_action :authenticate_user_account!, only: :index

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
    respond_to do |format|
      format.json do
        render json: data_json(@collection, msg: "processed")
      end
    end
  end

  def update
    @collection = Collection.find params[:id]
    authorize @collection
    @collection.update_attributes collection_params

    respond_to do |format|
      format.json do
        render json: data_json(@collection)
      end
    end
  end

  def index
    policy_scope(Collection)

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        paginate = false
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-collections-#{cache_key_params}-#{Collection.maximum(:updated_at)}" do
          if params.keys.include?("all")
            data = policy_scope(Collection).
              includes(:translations).
              order("collection_translations.name ASC")
            extra_params = "all"
          elsif params[:collections_for_project]
            data = policy_scope(Collection).
              includes(:translations).
            extra_params = "collections_for_project_#{}"
          else
            page = params[:page] || 1
            data = policy_scope(Collection).
              includes(:translations).
              where(search_params).order("collection_translations.name ASC").
              paginate(page: page)
            paginate = true
            extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
          end
          
          {
            data: data.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
            data_type: "collections",
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

  def collection_params
    params.require(:collection).
      permit(
        'project_id', 
        translations_attributes: [:locale, :id, :name, :institution, :responsibles, :notes, :countries, :homepage, :interviewers]
    )
  end

  def search_params
    params.permit(
      :name,
      :project_id
    ).to_h
  end
end
