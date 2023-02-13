class LogosController < ApplicationController
  require 'open-uri'

  def create
    authorize UploadedFile
    @uploaded_file = UploadedFile.create(logo_params)

    respond @uploaded_file
  end

  def update
    @uploaded_file = UploadedFile.find(params[:id])
    authorize @uploaded_file
    @uploaded_file.update(logo_params)
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

  def logo_params
    params.require(:logo).permit(
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
