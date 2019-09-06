class CollectionsController < ApplicationController

  skip_before_action :authenticate_user_account!, only: [:index]

  def show
  end

  def index
    policy_scope(Collection)
    respond_to do |format|
      format.html { render 'react/app' }
      format.json do
        json = Rails.cache.fetch "collections-#{Collection.maximum(:updated_at)}" do
          {
            data: Collection.all.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
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
