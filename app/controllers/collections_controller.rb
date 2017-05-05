class CollectionsController < BaseController

  skip_before_action authenticate_user_account!, :only => :index

  actions :show, :index

  private

  def object
    @object = Collection.find_by_project_id(param, :include => :translations) unless param.nil?
    raise ActiveRecord::RecordNotFound if @object.nil?
    @object
  end

  def param
    params[:id] || params[:project_id]
  end

  def collection
    Collection.all(:include => :translations).sort_by(&:to_s)
  end

end
