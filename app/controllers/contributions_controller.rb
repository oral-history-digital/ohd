class ContributionsController < ApplicationController

  def create
    @contribution = Contribution.create(contribution_params)
    clear_cache @contribution.interview

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'interviews',
          id: @contribution.interview.archive_id,
          nested_data_type: 'contributions',
          nested_id: @contribution.id,
          data: ::ContributionSerializer.new(@contribution)
        }
      end
    end
  end

  def destroy 
    @contribution = Contribution.find(params[:id])
    interview = @contribution.interview 
    @contribution.destroy
    clear_cache interview

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

end
