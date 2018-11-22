class BiographicalEntriesController < ApplicationController

  def create
    authorize BiographicalEntry
    @biographical_entry = BiographicalEntry.create(biographical_entry_params)

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'people',
          id: @biographical_entry.person_id,
          nested_data_type: 'biographical_entries',
          nested_id: @biographical_entry.id,
          data: ::BiographicalEntrySerializer.new(@biographical_entry).as_json
        }
      end
    end
  end

  def show
    authorize BiographicalEntry
    @interview = Interview.find_by_archive_id params[:id]
    @alpha2_locale = params[:lang]
    respond_to do |format|
      format.pdf do
        @alpha2_locale = params[:lang]
        @project_locale = ISO_639.find(params[:lang]).send(Project.alpha)
        pdf = render_to_string(:template => '/latex/biographical_entries.pdf.erb', :layout => 'latex.pdf.erbtex')
        send_data pdf, filename: "#{@interview.archive_id}_biography_#{params[:lang]}.pdf", :type => "application/pdf", :disposition => "attachment"
      end
    end
  end

  def update
    @biographical_entry = BiographicalEntry.find(params[:id])
    authorize @biographical_entry
    updated_at = @biographical_entry.updated_at
    @biographical_entry.update_attributes(biographical_entry_params)
    clear_biographical_entry_cache @biographical_entry.id, updated_at

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'people',
          id: @biographical_entry.person_id,
          nested_data_type: 'biographical_entries',
          nested_id: @biographical_entry.id,
          data: ::BiographicalEntrySerializer.new(@biographical_entry).as_json
        }
      end
    end
  end

  def destroy 
    @biographical_entry = BiographicalEntry.find(params[:id])
    authorize @biographical_entry
    @biographical_entry.destroy

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def biographical_entry_params
    params.require(:biographical_entry).permit(:person_id, :text, :start_date, :end_date, :workflow_state)
  end

  def clear_biographical_entry_cache id, updated_at
    Rails.cache.delete "#{Project.project_id}-biographical_entry-#{id}-#{updated_at}"
  end

end
