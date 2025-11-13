class ContributionTypesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index]

  def create
    authorize ContributionType
    @contribution_type = ContributionType.create(contribution_type_params)

    respond @contribution_type
  end

  def show
    @contribution_type = ContributionType.find params[:id]
    authorize @contribution_type

    respond @contribution_type
  end

  def update
    @contribution_type = ContributionType.find params[:id]
    authorize @contribution_type
    @contribution_type.update contribution_type_params

    respond @contribution_type
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
    @component = 'ContributionTypes'

    respond_to do |format|
      format.html { render "react/app" }
      format.json do
        paginate = false
        json = Rails.cache.fetch "#{current_project.shortname}-contribution_types-#{cache_key_params}-#{ContributionType.count}-#{ContributionType.maximum(:updated_at)}" do
          if params[:for_projects]
            data = current_project.contribution_types.
              includes(:translations).
              order("contribution_type_translations.label ASC")
            extra_params = "for_projects_#{current_project.id}"
          else
            page = params[:page] || 1
            data = current_project.contribution_types.
              includes(:translations).
              where(search_params).order("contribution_type_translations.label ASC").
              paginate(page: page)
            paginate = true
            extra_params = search_params.update(page: page).inject([]) { |mem, (k, v)| mem << "#{k}_#{v}"; mem }.join("_")
          end

          {
            data: data.inject({}) { |mem, s| mem[s.id] = cache_single(s); mem },
            nested_data_type: "contribution_types",
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

  private

    def respond contribution_type
      respond_to do |format|
        format.json do
          render json: {
            nested_id: contribution_type.id,
            data: cache_single(contribution_type),
            nested_data_type: "contribution_types",
            data_type: 'projects',
            id: current_project.id,
          }
        end
      end
    end

    def contribution_type_params
      params.require(:contribution_type).permit(
        :code,
        #:use_as_speaker,
        :use_in_details_view,
        :display_on_landing_page,
        :use_in_export,
        :order,
        :project_id,
        translations_attributes: [:locale, :id, :label]
      )
    end

    def search_params
      params.permit(
        :label,
        :code
      ).to_h.select{|k,v| !v.blank? }
    end
end
