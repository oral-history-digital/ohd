class Admin::UserAnnotationsController < Admin::BaseController

  actions :index, :show

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

  def accept
    object.accept!
    @flash = 'Nutzeranmerkung veröffentlicht.'
    render_workflow_change
  end

  def reject
    object.reject!
    @flash = 'Nutzeranmerkung abgelehnt.'
    render_workflow_change
  end

  def remove
    object.remove!
    @flash = 'Nutzeranmerkung aus dem Archiv entfernt.'
    render_workflow_change
  end

  def withdraw
    object.withdraw!
    @flash = 'Nutzeranmerkung aus der Veröffentlichung zurückgezogen.'
    render_workflow_change
  end

  def postpone
    object.postpone!
    @flash = 'Veröffentlichung der Nutzeranmerkung zurückgestellt.'
    render_workflow_change
  end

  def review
    object.review!
    @flash = 'Rückstellung der Nutzeranmerkung aufgehoben.'
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
    conditions = [ conditionals.join(' AND ') ] + condition_args
    @user_annotations = UserAnnotation.find(:all, :conditions => conditions, :include => :user, :order => "submitted_at DESC")
  end

  def render_workflow_change
    respond_to do |format|
      format.html do
        flash[:alert] = @flash
        redirect_to admin_user_annotations_path(params)
      end
      format.js do
        flash.now[:alert] = @flash
        annotation_html = render_to_string(:partial => 'user_annotation', :object => @object)
        render :update do |page|
          page.replace("user_annotation_#{@object.id}", annotation_html)
        end
      end
    end
  end

end