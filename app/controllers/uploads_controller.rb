class UploadsController < ApplicationController

  layout 'responsive'

  def new
    authorize :upload, :new?
    respond_to do |format|
      format.html { render 'react/app' }
      format.json { render json: :ok }
    end
  end

  def create
    authorize :upload, :create?
    # write a tmp-file to be processed in bg-job later
    #
    file = params[:upload].delete(:data)
    file_path = File.join(Rails.root, 'tmp', file.original_filename)
    File.open(file_path, 'wb') {|f| f.write(file.read) }

    "read_#{upload_params[:type]}_file_job".classify.constantize.perform_later(file_path)

    respond_to do |format|
      format.html { render 'react/app' }
      format.json do 
        render json: {
          msg: "processing",
          id: file.original_filename,
          data_type: 'uploads'
        }, status: :ok
      end
    end
  end

  private

  def upload_params
    params.require(:upload).permit(:type)
  end

end
