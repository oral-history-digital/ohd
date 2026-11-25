class EditTablesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:import_template]
  skip_after_action :verify_authorized, only: [:import_template]

  # Queues an authorized upload and defers all interview changes to the import job.
  # @return [void]
  def create
    raise ActiveRecord::RecordNotFound unless current_project

    interview = current_project.interviews.find_by!(archive_id: edit_table_params[:archive_id])
    authorize interview, :update?

    file = params.require(:edit_table).require(:data)
    raise ActionController::BadRequest, 'Expected an edit-table file' unless file.is_a?(ActionDispatch::Http::UploadedFile)

    temporary = Tempfile.create(['edit-table-', '.csv'], Rails.root.join('tmp'), binmode: true)
    begin
      IO.copy_stream(file.tempfile, temporary)
      file_path = temporary.path
    ensure
      temporary.close
    end

    ReadEditTableJob.perform_later({
      interview: interview,
      file_path: file_path,
      filename: file.original_filename,
      contributions_attributes: edit_table_params[:contributions_attributes]&.to_h,
      locale: params[:locale],
      only_references: edit_table_params[:only_references],
      user: current_user
    })

    respond_to do |format|
      format.json do
        render json: {
          msg: "processing",
          id: file.original_filename,
          data_type: 'uploads'
        }, status: :ok
      end
    end
  end

  def show
    interview = Interview.find_by_archive_id(params[:id])
    authorize interview, :download?

    cache_key_date = [interview.segments.maximum(:updated_at), interview.updated_at].max

    respond_to do |format|
      format.csv do
        send_data EditTableExport.new(params[:id], params[:locale]).process,
          type: "application/csv",
          filename: "#{interview.archive_id}_er_#{DateTime.now.strftime("%Y_%m_%d")}.csv"
      end
    end
  end

  def import_template
    interview = Interview.find_by_archive_id(params[:id])
    csv = EditTableImportTemplate.new(interview, params[:locale]).csv

    respond_to do |format|
      format.csv do
        send_data csv, filename: 'edit-table-import-template.csv', type: 'text/csv'
      end
    end
  end

  private

  def edit_table_params
    @edit_table_params ||= params.require(:edit_table).
      permit(
        :archive_id,
        :only_references,
        contributions_attributes: [:id, :person_id, :contribution_type_id, :speaker_designation]
    )
  end
end
