class UserContentsController < BaseController

  layout 'workspace', :except => [ :show, :create ]

  belongs_to :user

  actions :create, :show, :index

  before_filter :determine_user!

  create do
    wants.html do
      render :action => 'show'
    end
    wants.js do
      render :partial => 'show', :object => @object
    end
  end

  create.flash nil

  show do
    wants.html do
    end
    wants.js do
      if @object.new_record?
        render :nothing => true, :status => 404
      else
        render :partial => 'show', :object => @object
      end
    end
  end

  private

  # find the object with the current_user id and the id_hash parameter
  def object
    @object ||= begin
      @id_hash = params[:id]
      @type = params[:type]
      unless @type.blank?
        klass = @type.capitalize.constantize
        @object = @id_hash.blank? ? klass.new : klass.find(:first, :conditions => ["user_id = ? AND id_hash = ?", current_user.id, @id_hash ])
      end
    end
    @user_content = @object
  end

  def model_name
    @type = params[:type].blank? ? 'user_content' : params[:type].downcase
  end

  def object_params
    @object_params ||= begin
      attributes = {}
      params[model_name].each_pair do |k,v|
        a = ActiveSupport::JSON.decode(v)
        attributes[k.to_sym] = a.is_a?(String) ? a.sub(/(\d{2})(-)(\d{2})$/, '\1:\3') : a
      end
      attributes
    end
  end

  def build_object
    @object = model_name.capitalize.constantize.new object_params
    @object.user = current_user
    @object
  end

  def collection
    end_of_association_chain.find(:all, :conditions => ['user_id = ?', current_user.id])
  end

end