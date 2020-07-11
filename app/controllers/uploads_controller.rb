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
    file_path = create_tmp_file(file)

    locale = upload_params[:lang]
    "read_#{upload_params[:type]}_file_job".classify.constantize.perform_later(file_path, current_user_account, current_project, locale)

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
    params.require(:upload).permit(:type, :lang)
  end

end
