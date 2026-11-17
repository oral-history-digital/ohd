class SponsorLogosController < ApplicationController
  require 'open-uri'

  def create
    authorize UploadedFile
    raise ActiveRecord::RecordNotFound unless current_project

    attributes = sponsor_logo_params
    if attributes[:ref_type] != 'Project' || attributes[:ref_id].to_s != current_project.id.to_s
      raise ActiveRecord::RecordNotFound
    end

    @uploaded_file = current_project.sponsor_logos.build(attributes.except(:id, :type, :ref_id, :ref_type))
    unless @uploaded_file.save
      return render json: { errors: @uploaded_file.errors.full_messages }, status: :unprocessable_entity
    end

    respond @uploaded_file
  end

  def update
    @uploaded_file = UploadedFile.find(params[:id])
    authorize @uploaded_file
    @uploaded_file.update(sponsor_logo_params)
    respond @uploaded_file
  end

  def destroy 
    @uploaded_file = UploadedFile.find(params[:id])
    authorize @uploaded_file
    @uploaded_file.destroy

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  def index
    policy_scope(UploadedFile)
    respond_to do |format|
      format.html { render 'react/app' }
    end
  end

  private

  def respond uploaded_file
    uploaded_file.ref.touch

    respond_to do |format|
      format.json do
        render json: {
          data_type: uploaded_file.ref_type.underscore.pluralize,
          id: uploaded_file.ref_id,
          nested_data_type: uploaded_file.type.underscore.pluralize,
          nested_id: uploaded_file.id,
          data: ::UploadedFileSerializer.new(uploaded_file).as_json
        }
      end
    end
  end

  def sponsor_logo_params
    params.require(:sponsor_logo).permit(
      :id, 
      :type,
      :ref_id, 
      :ref_type,
      :locale,
      :file,
      :href,
      :title
    )
  end

end
