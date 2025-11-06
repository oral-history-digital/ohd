class ContributionsController < ApplicationController

  def create
    authorize Contribution
    @contribution = Contribution.create(contribution_params)
    respond @contribution
  end

  def update
    @contribution = Contribution.find(params[:id])
    authorize @contribution
    @contribution.update(contribution_params)
    respond @contribution
  end

  def destroy 
    @contribution = Contribution.find(params[:id])
    authorize @contribution
    interview = @contribution.interview 
    @contribution.destroy
    interview.touch

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def respond(contribution)
    contribution.interview.touch

    if contribution.contribution_type.code == 'interviewee'
      reload_data_type = 'interviews'
      reload_id = contribution.interview.archive_id
    else
      reload_data_type = nil
      reload_id = nil
    end

    respond_to do |format|
      format.json do
        render json: {
          data_type: 'interviews',
          id: contribution.interview.archive_id,
          nested_data_type: 'contributions',
          nested_id: contribution.id,
          data: ::ContributionSerializer.new(contribution).as_json,
          reload_data_type: reload_data_type,
          reload_id: reload_id
        }
      end
    end
  end

  def contribution_params
    params.require(:contribution).permit(:contribution_type_id, :interview_id, :person_id, :workflow_state, :speaker_designation)
  end

end
