class CollectionsController < ApplicationController

  skip_before_action :authenticate_user_account!, only: [:index]

  def show
  end

  def index
    policy_scope(Collection)
    respond_to do |format|
      format.html { render 'react/app' }
      format.json do
        extra_params = params[:collections_for_project] ?  "collections_for_project_#{params[:collections_for_project]}" : nil
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-collections-#{extra_params ? extra_params : 'all'}-#{Collection.maximum(:updated_at)}" do
          {
            data: current_project.collections.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            data_type: 'collections',
          }
        end
        render json: json
      end
    end
  end

  def countries
    render layout: 'webpacker'
  end

  private

end
