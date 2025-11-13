class TranslationValuesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :translations_by_locale]
  skip_after_action :verify_authorized, only: [:translations_by_locale]

  def create
    authorize TranslationValue
    @translation_value = TranslationValue.create translation_value_params
    respond_to do |format|
      format.json do
        render json: data_json(@translation_value, msg: "processed")
      end
    end
  end

  def update
    @translation_value = TranslationValue.find params[:id]
    authorize @translation_value
    @translation_value.update translation_value_params

    respond_to do |format|
      format.json do
        render json: data_json(@translation_value)
      end
    end
  end

  def index
    @component = 'TranslationValues'
    if params.keys.include?("all")
      translation_values = policy_scope(TranslationValue).all
      extra_params = "all"
    else
      page = params[:page] || 1
      translation_values = policy_scope(TranslationValue).includes(:translations).where(search_params).order(:key).paginate page: page
      extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
    end

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        json = Rails.cache.fetch "#{current_project.shortname}-translation_values-#{extra_params ? extra_params : "all"}-#{TranslationValue.count}-#{TranslationValue.maximum(:updated_at)}" do
          {
            data: translation_values.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
            data_type: "translation_values",
            extra_params: extra_params,
            page: params[:page] || 1,
            result_pages_count: translation_values.respond_to?(:total_pages) ? translation_values.total_pages : nil,
          }
        end
        render json: json
      end
    end
  end

  def translations_by_locale
    respond_to do |format|
      format.json do
        translations = translations_for_locale
        render json: { translations: translations }
      end
    end
  end

  def destroy
    @translation_value = TranslationValue.find(params[:id])
    authorize @translation_value
    @translation_value.destroy

    respond_to do |format|
      format.html do
        render :action => "index"
      end
      format.js
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def translation_value_params
    params.require(:translation_value).
      permit(
        'key',
        translations_attributes: [:locale, :id, :value]
    )
  end

  def search_params
    params.permit(
      :key,
      :value,
    ).to_h.select{|k,v| !v.blank? }
  end

end
