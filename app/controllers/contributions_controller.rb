class ContributionsController < ApplicationController

  def create
    @contribution = Contribution.create(contribution_params)
    clear_interview_cache @contribution.interview

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'interviews',
          id: @contribution.interview.archive_id,
          nested_data_type: 'contributions',
          #nested_data_type: "#{@contribution.contribution_type}_contributions",
          data: ::ContributionSerializer.new(@contribution)
        }
      end
    end
  end

  def destroy 
    @contribution = Contribution.find(params[:id])
    interview = @contribution.interview 
    @contribution.destroy
    clear_interview_cache interview

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def contribution_params
    params.require(:contribution).permit(:contribution_type, :interview_id, :person_id)
  end

  def clear_interview_cache(interview)
    Rails.cache.delete "interview-#{interview.archive_id}-#{interview.updated_at}"
  end

end
