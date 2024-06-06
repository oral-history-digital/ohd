class ExternalLinksController < ApplicationController
  before_action :set_external_link, only: [:update, :destroy]

  def create
    authorize ExternalLink
    @external_link = ExternalLink.create external_link_params
    @external_link.project.touch

    respond_to do |format|
      format.json do
        render json: {
          id: @external_link.project_id,
          data_type: 'projects',
          nested_data_type: 'external_links',
          nested_id: @external_link.id,
          data: cache_single(@external_link),
        }
      end
    end
  end

  def update
    @external_link.update(external_link_params)
    @external_link.project.touch

    respond_to do |format|
      format.json do
        render json: {
          id: @external_link.project_id,
          data_type: 'projects',
          nested_data_type: 'external_links',
          nested_id: @external_link.id,
          data: cache_single(@external_link),
        }
      end
    end
  end

  def index
    @project = Interview.find_by_archive_id(params[:project_id])
    policy_scope(ExternalLink)
    respond_to do |format|
      format.html { render 'react/app' }
      format.json do
        json = Rails.cache.fetch("#{current_project.shortname}-project-external_links-#{@project.id}-#{@project.external_links.count}-#{@project.external_links.maximum(:updated_at)}") do
          {
            data: @project.external_links_for.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            nested_data_type: 'external_links',
            data_type: 'projects',
            id: params[:project_id]
          }
        end
        render json: json
      end
    end
  end

  def destroy
    project = @external_link.project
    @external_link.destroy
    project.touch

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: data_json(project, msg: 'processed') }
    end
  end

  def show
    @external_link = ExternalLink.find(params[:id])
    authorize @external_link
    respond_to do |format|
      format.json do
        render json: data_json(@external_link)
      end
    end
  end

  private

    def set_external_link
      @external_link = ExternalLink.find(params[:id])
      authorize @external_link
    end

    def external_link_params
      params.require(:external_link).permit(
        :project_id,
        :internal_name,
        translations_attributes: [:locale, :url, :name, :id]
      )

    end
end
