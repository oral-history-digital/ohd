class CollectionsController < ApplicationController

  #skip_before_action authenticate_user_account!, :only => :index
  before_action :collection, only: :index
  before_action :object, only: :show

  def show
  end

  def index
  end

  def countries
    render layout: 'webpacker'
  end

  private

  def object
    @collection = Collection.includes(:translations).find_by(project_id: param) unless param.nil?
    raise ActiveRecord::RecordNotFound if @collection.nil?
    @collection
  end

  def param
    params[:id] || params[:project_id]
  end

  def collection
    @collections = Collection.includes(:translations).all.sort_by(&:to_s)
  end

end
