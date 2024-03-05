class LanguagesController < ApplicationController
  skip_before_action :authenticate_user!, only: :index

  def new
    authorize Language
    respond_to do |format|
      format.html { render "react/app" }
      format.json { render json: {}, status: :ok }
    end
  end

  def create
    authorize Language
    @language = Language.create language_params
    respond_to do |format|
      format.json do
        render json: data_json(@language, msg: "processed")
      end
    end
  end

  def update
    @language = Language.find params[:id]
    authorize @language
    @language.update language_params

    respond_to do |format|
      format.json do
        render json: data_json(@language)
      end
    end
  end

  def index
    if params.keys.include?("all")
      languages = policy_scope(Language).all
      extra_params = "all"
    else
      page = params[:page] || 1
      languages = policy_scope(Language).includes(:translations).where(search_params).order("language_translations.name ASC").paginate page: page
      extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
    end

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        json = Rails.cache.fetch "#{current_project.shortname}-languages-#{extra_params ? extra_params : "all"}-#{Language.count}-#{Language.maximum(:updated_at)}" do
          languages = languages.includes(:translations)
          {
            data: languages.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
            data_type: "languages",
            extra_params: extra_params,
            page: params[:page] || 1,
            result_pages_count: languages.respond_to?(:total_pages) ? languages.total_pages : nil,
          }
        end
        render json: json
      end
    end
  end

  def destroy
    @language = Language.find(params[:id])
    authorize @language
    @language.destroy

    respond_to do |format|
      format.html do
        render :action => "index"
      end
      format.js
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def language_params
    params.require(:language).
      permit(
        'code',
        translations_attributes: [:locale, :id, :name]
    )
  end

  def search_params
    params.permit(
      :name,
    ).to_h.select{|k,v| !v.blank? }
  end
end
