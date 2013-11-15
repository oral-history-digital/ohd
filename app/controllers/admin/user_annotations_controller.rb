class Admin::UserAnnotationsController < Admin::BaseController

  actions :index, :show, :update

  def index
    collection
    respond_to do |format|
      format.html do
        render
      end
      format.js do
        render :layout => false
      end
    end
  end

  # admin#update may only change description (independent of workflow_state!)
  def update
    object.update_attribute :description, object_params['description']
    # also update the published annotation object
    unless @object.annotation.nil?
      @object.annotation.update_attribute :text, object_params['description']
    end
    respond_to do |format|
      format.html do
        # this is just a fallback
        render :action => :index
      end
      format.js do
        html = render_to_string :partial => 'user_annotation', :object => @object, :locals => {:container_open => true}, :layout => false
        render :update do |page|
          page.replace "user_annotation_#{@object.id}", html
          page.visual_effect :fade, 'shades'
          page << "$('ajax_spinner').hide()"
        end
      end
    end
  end

  def accept
    object.update_attribute(:description, params['description']) unless params['description'].blank?
    object.accept!
    @flash = 'Nutzeranmerkung veröffentlicht.'
    render_workflow_change
    expire_annotation_cache
  end

  def reject
    object.update_attribute(:description, params['description']) unless params['description'].blank?
    object.reject!
    @flash = 'Nutzeranmerkung abgelehnt.'
    render_workflow_change
  end

  def remove
    object.update_attribute(:description, params['description']) unless params['description'].blank?
    object.remove!
    @flash = 'Nutzeranmerkung aus dem Archiv entfernt.'
    render_workflow_change
    expire_annotation_cache
  end

  def withdraw
    object.update_attribute(:description, params['description']) unless params['description'].blank?
    object.withdraw!
    @flash = 'Nutzeranmerkung aus der Veröffentlichung zurückgezogen.'
    render_workflow_change
    expire_annotation_cache
  end

  def postpone
    object.update_attribute(:description, params['description']) unless params['description'].blank?
    object.postpone!
    @flash = 'Veröffentlichung der Nutzeranmerkung zurückgestellt.'
    render_workflow_change
  end

  def review
    object.update_attribute(:description, params['description']) unless params['description'].blank?
    object.review!
    @flash = 'Ablehnung der Nutzeranmerkung aufgehoben.'
    render_workflow_change
  end

  private

  def collection
    @filters = {}
    conditionals = []
    condition_args = []
    # workflow state
    @filters['workflow_state'] = params['workflow_state'] || 'proposed'
    unless @filters['workflow_state'].blank? || @filters['workflow_state'] == 'all'
      conditionals << "(workflow_state = '#{@filters['workflow_state']}'" + (@filters['workflow_state'] == "unchecked" ? " OR workflow_state IS NULL)" : ")")
    end
    @filters['workflow_state']
    # user name
    %w(last_name first_name).each do |name_part|
      @filters[name_part] = params[name_part]
      unless @filters[name_part].blank?
        conditionals << "users.#{name_part} LIKE ?"
        condition_args << @filters[name_part] + '%'
      end
    end
    @filters['media_id'] = params['media_id']
    unless @filters['media_id'].blank?
      conditionals << "properties LIKE ?"
      condition_args << "%media_id: #{ActiveRecord::Base.connection.quote(@filters['media_id'].upcase)[1..-2]}%"
    end
    @filters = @filters.delete_if{|k,v| v.blank? || v == 'all' }
    # never show private annotations
    conditionals << "workflow_state != ?"
    condition_args << "private"
    conditions = [ conditionals.join(' AND ') ] + condition_args
    @user_annotations = UserAnnotation.all(:conditions => conditions, :include => :user, :order => "submitted_at DESC")
  end

  def render_workflow_change
    respond_to do |format|
      format.html do
        flash[:alert] = @flash
        redirect_to admin_user_annotations_path(params)
      end
      format.js do
        flash.now[:alert] = @flash
        annotation_html = render_to_string(:partial => 'user_annotation', :object => @object, :locals => {:container_open => true})
        render :update do |page|
          page.replace("user_annotation_#{@object.id}", annotation_html)
        end
      end
    end
  end

  def expire_annotation_cache
    expire_fragment(fragment_cache_key("annotations_#{@object.archive_id}"))
  end

end
