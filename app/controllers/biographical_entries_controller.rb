class BiographicalEntriesController < ApplicationController

  def create
    authorize BiographicalEntry
    @biographical_entry = BiographicalEntry.create(biographical_entry_params)

    respond_to do |format|
      format.json do
        render json: {
          nested_id: @biographical_entry.person_id,
          data: cache_single(@biographical_entry.person),
          nested_data_type: "people",
          data_type: 'projects',
          id: current_project.id,
        }
      end
    end
  end

  def show
    authorize BiographicalEntry
    @interview = Interview.find_by_archive_id params[:id]
    @locale = params[:lang]
    @biography = true
    respond_to do |format|
      format.pdf do
        pdf = Rails.cache.fetch("#{current_project.cache_key_prefix}-biographical-entries-#{@interview.archive_id}-#{@interview.interviewees.first.biographical_entries.maximum(:updated_at)}-#{@locale}") do
          render_to_string(:template => '/latex/biographical_entries.pdf.erb', :layout => 'latex.pdf.erbtex')
        end
        send_data pdf, filename: "#{@interview.archive_id}_biography_#{params[:lang]}.pdf", :type => "application/pdf", :disposition => "attachment"
      end
    end
  end

  def update
    @biographical_entry = BiographicalEntry.find(params[:id])
    authorize @biographical_entry
    updated_at = @biographical_entry.updated_at
    @biographical_entry.update_attributes(biographical_entry_params)

    respond_to do |format|
      format.json do
        render json: {
          nested_id: @biographical_entry.person_id,
          data: cache_single(@biographical_entry.person),
          nested_data_type: "people",
          data_type: 'projects',
          id: current_project.id,
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
      format.json do
        render json: {
          nested_id: @biographical_entry.person_id,
          data: cache_single(@biographical_entry.person),
          nested_data_type: "people",
          data_type: 'projects',
          id: current_project.id,
        }
      end
    end
  end

  private

  def biographical_entry_params
    params.require(:biographical_entry).permit(:person_id, :text, :start_date, :end_date, :workflow_state)
  end

end
