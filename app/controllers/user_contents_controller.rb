class UserContentsController < BaseController

  layout 'workspace', :except => [ :show, :create ]

  belongs_to :user

  actions :create, :update, :show, :index, :destroy

  before_filter :determine_user!
  skip_before_filter :determine_user

  skip_before_filter :current_search_for_side_panel

  before_filter :authorize_owner!, :only => [ :update, :destroy ]
  rescue_from ActiveRecord::ReadOnlyRecord, :with => :unauthorized_access

  create do
    wants.html do
      render :action => 'show'
    end
    wants.js do
      render :partial => 'show', :object => @object
    end
    failure do
      wants.html do
        render :action => 'show'
      end
      wants.js do
        render :partial => 'show', :object => @object
      end
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

  index do
    wants.html do
    end
    wants.js do
      html = render_to_string :template => '/user_contents/index.html.erb', :layout => false
      render :update do |page|
        page.replace_html 'innerContent', html
        page.visual_effect :fade, 'overlay', :duration => 0.4, :queue => 'end'
      end
    end
  end

  show do
    wants.html do
      if @object.nil? || @object.new_record?
        render :nothing => true, :status => 404
      else
        render
      end
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
      html = render_to_string :partial => 'user_content', :object => @object
      render :update do |page|
        page.replace "user_content_#{object.id}", html
      end
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
    @type = params[:type].blank? ? 'user_content' : params[:type].underscore
  end

  def object_params
    @object_params ||= begin
      attributes = {}
      params[model_name].each_pair do |k,v|
        if k == 'title'
          attributes[k.to_sym] = v
        else
          a = ActiveSupport::JSON.decode(v)
          attributes[k.to_sym] = a.is_a?(String) ? a.sub(/(\d{2})(-)(\d{2})$/, '\1:\3') : a
        end
      end
      # truncate to length of database columns
      @@content_column_limits ||= UserContent.content_columns.inject({}){|h, c| h[c.name] = c.limit unless c.limit.blank?; h}
      attributes.each do |attr, value|
        if @@content_column_limits.keys.include?(attr.to_s) && value.length > @@content_column_limits[attr.to_s]
          attributes[attr] = @template.truncate(value, :length => @@content_column_limits[attr.to_s])
        end
      end
    end
  end

  def build_object
    @object = model_name.camelize.constantize.new object_params
    @object.user = current_user
    @object
  end

  # derives the SQL conditions in Array format from filter params
  def filter_conditions
    conds = []
    values = []
    filters = params['content_filters'] || {}
    types = []
    UserContent::CONTENT_TYPES.each do |content_type|
      filter_value = filters[content_type.to_s.underscore]
      types << content_type.to_s.camelize if filter_value.blank? || filter_value == 0
    end
    conds << "type in ('#{types.join("','")}')"
    conditions = [ conds.join(' AND ') ]
    values.each do |value|
      conditions << value
    end
    conditions
  end

  def collection
    conditions = filter_conditions
    sql_conditions = []
    sql_conditions << [conditions.shift, 'user_id = ?'].delete_if{|el| el.blank? }.join(' AND ')
    sql_conditions += conditions
    sql_conditions << current_user.id
    end_of_association_chain.find(:all, :conditions => sql_conditions, :order => "created_at DESC")
  end

end