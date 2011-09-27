class UserContentsController < BaseController

  layout nil

  belongs_to :user

  actions :create, :show, :index

  create.before do
    puts "\n@@@ BEFORE CREATE:\nobject: #{@object.inspect}\ntype: #{@type}\nobject_params: #{object_params.inspect}\nparams: #{params.inspect}\n@@@"
  end

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
    @type = params[:type].downcase || 'user_content'
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

end