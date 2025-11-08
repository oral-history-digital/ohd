class UploadsController < ApplicationController

  skip_before_action :authenticate_user!, only: [:new, :metadata_import_template]
  skip_after_action :verify_authorized, only: [:metadata_import_template]

  def new
    @component = 'UploadsPage'
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
    "read_#{upload_params[:type]}_file_job".
      classify.constantize.perform_later({
        file_path: file_path,
        user: current_user,
        project: current_project,
        locale: locale,
      })

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

  def metadata_import_template
    csv = MetadataImportTemplate.new(current_project, params[:locale]).csv

    respond_to do |format|
      format.csv do
        send_data csv, filename: 'metadata-import-template.csv', type: 'text/csv'
      end
    end
  end

  private

  def upload_params
    params.require(:upload).permit(:type, :lang)
  end

end
