class CollectionsController < BaseController

  skip_before_filter :authenticate_user!, :only => :index

  actions :show, :index

  index.response do |wants|
    wants.html do
      render_localized :action => :index
    end
  end

  private

  def object
    @object = Collection.find_by_project_id(param) unless param.nil?
    raise ActiveRecord::RecordNotFound if @object.nil?
    @object
  end

  def param
    params[:id] || params[:project_id]
  end

  def collection
    end_of_association_chain.find(:all, :order => "name ASC")
  end

end
