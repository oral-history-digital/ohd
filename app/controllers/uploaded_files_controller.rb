class UploadedFilesController < ApplicationController
  require 'open-uri'

  def create
    authorize UploadedFile
    #data = params[:uploaded_file].delete(:data)
    @uploaded_file = UploadedFile.create(uploaded_file_params)
    #@uploaded_file.uploaded_file.attach(io: data, filename: "#{@uploaded_file.interview.archive_id.upcase}_#{str = format('%02d', @uploaded_file.interview.uploaded_files.count)}", metadata: {title: uploaded_file_params[:caption]})

    respond @uploaded_file
  end

  def update
    @uploaded_file = UploadedFile.find(params[:id])
    authorize @uploaded_file
    @uploaded_file.update_attributes(uploaded_file_params)
    respond @uploaded_file
  end

  def destroy 
    @uploaded_file = UploadedFile.find(params[:id])
    authorize @uploaded_file
    ref = @uploaded_file.ref
    @uploaded_file.destroy
    ref.touch

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: data_json(ref, msg: 'processed') }
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

  def uploaded_file_params
    params.require(:uploaded_file).permit(
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
