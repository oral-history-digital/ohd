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
    flash['alert'] = 'Nutzeranmerkung veröffentlicht.'
    redirect_to admin_user_annotation_path(@object)
  end

  def reject
    object.reject!
    flash['alert'] = 'Nutzeranmerkung abgelehnt.'
    redirect_to admin_user_annotation_path(@object)
  end

  def remove
    object.remove!
    flash['alert'] = 'Nutzeranmerkung aus dem Archiv entfernt.'
    redirect_to admin_user_annotation_path(@object)
  end

  def withdraw
    object.withdraw!
    flash['alert'] = 'Nutzeranmerkung aus der Veröffentlichung zurückgezogen.'
    redirect_to admin_user_annotation_path(@object)
  end

  def postpone
    object.postpone!
    flash['alert'] = 'Veröffentlichung der Nutzeranmerkung zurückgestellt.'
    redirect_to admin_user_annotation_path(@object)
  end

  def review
    object.review!
    flash['alert'] = 'Rückstellung der Nutzeranmerkung aufgehoben.'
    redirect_to admin_user_annotation_path(@object)
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

end