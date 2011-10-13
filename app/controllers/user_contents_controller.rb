class UserContentsController < BaseController

  layout 'workspace', :except => [ :show, :create ]

  belongs_to :user

  actions :create, :update, :show, :index, :destroy

  before_filter :determine_user!
  skip_before_filter :determine_user

  before_filter :authorize_owner!, :only => [ :update, :destroy ]
  rescue_from ActiveRecord::ReadOnlyRecord, :with => :unauthorized_access

  create do
    wants.html do
      render :action => 'show'
    end
    wants.js do
      render :partial => 'show', :object => @object
    end
  end

  destroy do
    wants.html do
      render :action => 'index'
    end
    wants.js do
      render :update do |page|
        page.visual_effect(:switch_off, "user_content_#{@object.id}", { 'afterFinish' => "function(){Element.remove($('user_content_#{@object.id}'));}" })
      end
    end
  end

  create.flash nil

  update.flash nil

  destroy.flash nil

  show do
    wants.html do
    end
    wants.js do
      if @object.nil? || @object.new_record?
        render :nothing => true, :status => 404
      else
        render :partial => 'show', :object => @object
      end
    end
  end

  update do
    wants.html do
      redirect_to :action => 'show'
    end
    wants.js do
      render :partial => 'user_content', :object => @object
    end
  end

  protected

  def unauthorized_access
    render :nothing => true, :status => 403
  end

  private

  # make sure the current_user is the owner of the resource
  def authorize_owner!
    unless object.user == current_user
      raise ActiveRecord::ReadOnlyRecord
    end
  end

  # find the object with the current_user id and the id_hash parameter
  def object
    @object ||= begin
      @id_hash = params[:id]
      @type = params[:type] || 'user_content'
      unless @type.blank?
        klass = @type.camelize.constantize
        @object = begin
          if @id_hash.blank?
            klass.new
          else
            id_attr = @id_hash.to_i > 0 ? 'id' : 'id_hash'
            klass.find(:first, :conditions => ["user_id = ? AND #{id_attr} = ?", current_user.id, @id_hash ])
          end
        end
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
    end_of_association_chain.find(:all, :conditions => ['user_id = ?', current_user.id], :order => "created_at DESC")
  end

end