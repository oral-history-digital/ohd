class AffiliatesController < ApplicationController
  before_action :set_affiliate, only: %i[ update destroy ]
  before_action :normalize_affiliate_params, only: [:create, :update]


  # POST /affiliates
  def create
    authorize Affiliate
    @affiliate = Affiliate.create(affiliate_params)

    respond_to do |format|
      format.json do
        render json: {
          id: @affiliate.project_id,
          data_type: 'projects',
          nested_data_type: @affiliate.type.underscore.pluralize,
          nested_id: @affiliate.id,
          data: cache_single(@affiliate, serializer_name: 'Affiliate'),
        }
      end
    end
  end

  # PATCH/PUT /affiliates/1
  def update
    @affiliate.update(affiliate_params)

    respond_to do |format|
      format.json do
        render json: {
          id: @affiliate.project_id,
          data_type: 'projects',
          nested_data_type: @affiliate.type.underscore.pluralize,
          nested_id: @affiliate.id,
          data: cache_single(@affiliate, serializer_name: 'Affiliate'),
        }
      end
    end
  end

  # DELETE /affiliates/1
  def destroy
    project = @affiliate.project
    @affiliate.destroy
    project.touch

    respond_to do |format|
      format.html do
        render :action => 'index'
      end
      format.json { render json: data_json(project, msg: 'processed') }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_affiliate
      @affiliate = Affiliate.find(params.expect(:id))
      authorize @affiliate
    end

    def normalize_affiliate_params
      %w[funder cooperation_partner leader manager].each do |type|
        if params.key?(type)
          params[:affiliate] = params.delete(type)
          break
        end
      end
    end

    def affiliate_params
      params.expect(affiliate: [:type, :name_type, :name, :url, :project_id])
    end
end
