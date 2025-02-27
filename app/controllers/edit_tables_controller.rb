class EditTablesController < ApplicationController

  skip_before_action :authenticate_user!, only: [:import_template]
  skip_after_action :verify_authorized, only: [:import_template]

  def create
    interview = Interview.find_by_archive_id(edit_table_params[:archive_id])
    authorize interview, :update?

    file = params[:edit_table].delete(:data)
    file_path = create_tmp_file(file)

    update_contributions(interview, edit_table_params[:contributions_attributes])

    ReadEditTableJob.perform_later({
      interview: interview,
      file_path: file_path,
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
        send_data EditTableExport.new(params[:id]).process, type: "application/csv", filename: "#{interview.archive_id}_er_#{DateTime.now.strftime("%Y_%m_%d")}.csv"
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
    params.require(:edit_table).
      permit(
        :archive_id,
        :only_references,
        contributions_attributes: [:id, :person_id, :contribution_type_id, :speaker_designation]
    )
  end
end
