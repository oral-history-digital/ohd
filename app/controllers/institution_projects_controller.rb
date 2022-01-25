class InstitutionProjectsController < ApplicationController
  def create
    authorize InstitutionProject
    @institution_project = InstitutionProject.create(institution_project_params)

    respond_to do |format|
      format.json do
        render json: {
          id: @institution_project.institution_id,
          data_type: 'institutions',
          data: Rails.cache.fetch("#{current_project.cache_key_prefix}-institutions-#{@institution_project.institution_id}"){::InstitutionSerializer.new(@institution_project.institution).as_json},
          reload_data_type: 'projects',
          reload_id: @institution_project.project_id,
        }, status: :ok
      end
    end
  end

  def destroy
    @institution_project = InstitutionProject.find(params[:id])
    authorize @institution_project

    @institution_project.destroy

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json do
        render json: {
          id: @institution_project.institution_id,
          data_type: 'institutions',
          data: Rails.cache.fetch("#{current_project.cache_key_prefix}-institutions-#{@institution_project.institution_id}"){::InstitutionSerializer.new(@institution_project.institution).as_json},
          reload_data_type: 'projects',
          reload_id: @institution_project.project_id,
        }, status: :ok
      end
    end
  end

  private

  def institution_project_params
    params.require(:institution_project).permit(:institution_id, :project_id)
  end

end
