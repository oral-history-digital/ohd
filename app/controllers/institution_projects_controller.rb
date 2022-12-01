class InstitutionProjectsController < ApplicationController
  before_action :set_institution_project, only: [:update, :destroy]

  def create
    authorize InstitutionProject
    @institution_project = InstitutionProject.create institution_project_params
    @institution_project.project.touch

    respond_to do |format|
      format.json do
        render json: {
          id: @institution_project.project_id,
          data_type: 'projects',
          nested_data_type: 'institution_projects',
          nested_id: @institution_project.id,
          data: cache_single(@institution_project),
        }
      end
    end
  end

  def update
    @institution_project.update(institution_project_params)
    @institution_project.project.touch

    respond_to do |format|
      format.json do
        render json: {
          id: @institution_project.project_id,
          data_type: 'projects',
          nested_data_type: 'institution_projects',
          nested_id: @institution_project.id,
          data: cache_single(@institution_project),
        }
      end
    end
  end

  def index
    @project = Interview.find_by_archive_id(params[:project_id])
    policy_scope(InstitutionProject)
    respond_to do |format|
      format.html { render 'react/app' }
      format.json do
        json = Rails.cache.fetch("#{current_project.cache_key_prefix}-project-institution_projects-#{@project.id}-#{@project.institution_projects.count}-#{@project.institution_projects.maximum(:updated_at)}") do
          {
            data: @project.institution_projects_for.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            nested_data_type: 'institution_projects',
            data_type: 'projects',
            id: params[:project_id]
          }
        end
        render json: json
      end
    end
  end

  def destroy
    project = @institution_project.project
    @institution_project.destroy
    project.touch

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: data_json(project, msg: 'processed') }
    end
  end

  def show
    @institution_project = InstitutionProject.find(params[:id])
    authorize @institution_project
    respond_to do |format|
      format.json do
        render json: data_json(@institution_project)
      end
    end
  end

  private

    def set_institution_project
      @institution_project = InstitutionProject.find(params[:id])
      authorize @institution_project
    end

    def institution_project_params
      params.require(:institution_project).permit(
        :project_id,
        :institution_id
      )

    end
end
