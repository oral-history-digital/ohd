class EditTablesController < ApplicationController

  def create
    interview = Interview.find_by_archive_id(edit_table_params[:archive_id])
    authorize interview, :update?

    file = params[:edit_table].delete(:data)
    file_path = create_tmp_file(file)

    update_contributions(interview, edit_table_params[:contributions_attributes])

    ReadEditTableJob.perform_later(interview, file_path, edit_table_params[:only_references], current_user)

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
