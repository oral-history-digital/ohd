class MaterialsController < ApplicationController
  require 'open-uri'

  def create
    authorize Material
    @uploaded_file = params[:material].delete(:data)

    if @uploaded_file.content_type == "application/pdf" && uploaded_file_is_pdf?
      adapted_params = material_params
      adapted_params[:attachable_id] = adapted_params.delete(:interview_id)
      adapted_params[:attachable_type] = "Interview"

      @material = Material.create(adapted_params)
      @material.file.attach(io: @uploaded_file, filename: @uploaded_file.original_filename)

      respond_to do |format|
        format.json do
          render json: {
            data_type: 'interviews',
            id: @material.attachable.archive_id,
            nested_data_type: 'materials',
            nested_id: @material.id,
            data: ::MaterialSerializer.new(@material).as_json
          }
        end
      end
    else
      respond_to do |format|
        format.json do
          render json: {
            error: "File must be application/pdf"
          }, status: :bad_request
        end
      end
    end
  end

  def update
    @material = Material.find(params[:id])
    authorize @material

    adapted_params = material_params
    adapted_params[:attachable_id] = adapted_params.delete(:interview_id)
    adapted_params[:attachable_type] = "Interview"

    @material.update(adapted_params)

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'interviews',
          id: @material.attachable.archive_id,
          nested_data_type: 'materials',
          nested_id: @material.id,
          data: ::MaterialSerializer.new(@material).as_json
        }
      end
    end
  end

  def destroy
    @material = Material.find(params[:id])
    authorize @material
    @material.destroy
    clear_cache @material.attachable

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def material_params
    params.require(:material).permit(
      :interview_id,
      :workflow_state,
      translations_attributes: [:locale, :id, :title, :description]
    )
  end

  def uploaded_file_is_pdf?()
    `file --mime-type --brief #{@uploaded_file.tempfile.path}`.strip == 'application/pdf'
  end
end
