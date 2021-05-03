class ContributionTypesController < ApplicationController

  def create
    authorize ContributionType
    @contribution_type = ContributionType.create(contribution_type_params)

    respond_to do |format|
      format.json do
        render json: data_json(@contribution_type, msg: "processed")
      end
    end
  end

  def show
    @contribution_type = ContributionType.find params[:id]
    authorize @contribution_type

    respond_to do |format|
      format.json do
        render json: data_json(@contribution_type)
      end
    end
  end

  def update
    @contribution_type = ContributionType.find params[:id]
    authorize @contribution_type
    @contribution_type.update_attributes contribution_type_params

    respond_to do |format|
      format.json do
        render json: data_json(@contribution_type, msg: "processed")
      end
    end
  end

  def destroy 
    @contribution_type = ContributionType.find(params[:id])
    authorize @contribution_type
    contribution_type = @contribution_type
    @contribution_type.destroy

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  def index
    policy_scope ContributionType

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        paginate = false
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-contribution_types-#{cache_key_params}-#{ContributionType.maximum(:updated_at)}" do
          if params.keys.include?("all")
            data = current_project.contribution_types.
              includes(:translations).
              order("contribution_type_translations.name ASC")
            extra_params = "all"
          else
            page = params[:page] || 1
            data = current_project.contribution_types.
              includes(:translations).
              where(search_params).order("contribution_type_translations.name ASC").
              paginate(page: page)
            paginate = true
            extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
          end

          {
            data: data.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
            data_type: "contribution_types",
            extra_params: extra_params,
            page: params[:page] || 1,
            result_pages_count: paginate ? data.total_pages : nil,
          }
        end
        render json: json
      end
    end
  end

  private

    def contribution_type_params
      params.require(:contribution_type).permit(
        :code,
        #:use_in_transcript,
        :project_id,
        translations_attributes: [:locale, :id, :label]
      )
    end

    def search_params
      params.permit(
        :label,
        :code
      ).to_h
    end
end
