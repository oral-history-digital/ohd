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
    if params.keys.include?("all")
      collections = policy_scope(Collection).all
      extra_params = "all"
    else
      page = params[:page] || 1
      collections = policy_scope(Collection).includes(:translations).where(search_params).order("collection_translations.name ASC").paginate page: page
      extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
    end

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-collections-#{extra_params ? extra_params : "all"}-#{Collection.maximum(:updated_at)}" do
          collections = collections.includes(:translations)
          {
            data: collections.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
            data_type: "collections",
            extra_params: extra_params,
            page: params[:page] || 1,
            result_pages_count: collections.respond_to?(:total_pages) ? collections.total_pages : 1,
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
    ).to_h
  end
end
