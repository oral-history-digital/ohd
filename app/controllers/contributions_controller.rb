class ContributionsController < ApplicationController

  def create
    authorize Contribution
    @contribution = Contribution.create(contribution_params)
    clear_contributions_cache(@contribution.interview)
    respond @contribution
  end

  def update
    @contribution = Contribution.find(params[:id])
    authorize @contribution
    @contribution.update(contribution_params)
    clear_contributions_cache(@contribution.interview)
    respond @contribution
  end

  def destroy 
    @contribution = Contribution.find(params[:id])
    authorize @contribution
    interview = @contribution.interview 
    @contribution.destroy
    interview.touch
    clear_contributions_cache(interview)

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: {}, status: :ok }
    end
  end

  private

  def clear_contributions_cache(interview)
    # Clear the contributions collection cache
    interview.contributions.each do |contribution|
      # Clear individual contribution serialization cache for all locales
      I18n.available_locales.each do |locale|
        cache_key_prefix = current_project ? current_project.shortname : 'ohd'
        cache_key = "#{cache_key_prefix}-contribution-#{contribution.id}-#{contribution.updated_at}--#{locale}"
        Rails.cache.delete(cache_key)
      end
    end
    
    # Clear people cache for this interview's contributors
    # Build the exact cache key using the same logic as PeopleController#index
    cache_key_prefix = current_project ? current_project.shortname : 'ohd'
    
    # Reconstruct the cache_key_params for contributors_for_interview
    # The params would be: contributors_for_interview, project_id, locale, format
    params_string = "contributors_for_interview-#{interview.id}-project_id-#{current_project.shortname}-locale-#{I18n.locale}-format-json-"
    
    # Build the full cache key with Person.count and Person.maximum(:updated_at)
    cache_key = "#{cache_key_prefix}-people-#{params_string}-#{Person.count}-#{Person.maximum(:updated_at)}"
    Rails.cache.delete(cache_key)
  end

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
