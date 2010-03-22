class CollectionsController < BaseController

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

end
