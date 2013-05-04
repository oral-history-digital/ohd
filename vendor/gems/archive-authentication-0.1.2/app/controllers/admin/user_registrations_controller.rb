class Admin::UserRegistrationsController < Admin::BaseController

  def index
    collection
  end

  def edit
    object
  end

  def update
    @workflow_state = object.workflow_state
    # action dependent on submit value
    @object.admin_comments = object_params['admin_comments']
    workflow_changes = true
    @object.update_attributes(object_params)
    case params['workflow_event']
      when 'register'
        @object.register!
        flash[:alert] = "#{@object} wurde für die Aktivierung freigegeben (E-Mail an '#{@object.email}')."
      when 'postpone'
        @object.postpone!
        flash[:alert] = "#{@object} wurde zurückgestellt."
      when 'reject'
        @object.reject!
        flash[:alert] = "#{@object} wurde abgelehnt."
      when 'activate'
        if @workflow_state.to_s == 'checked'
          flash[:alert] = 'Benutzer muss seinen Account selbst aktivieren um ein Passwort zu erhalten.'
        else
          @object.activate!
          flash[:alert] = "#{@object} wurde aktiviert."
        end
      when 'expire'
        @object.expire!
        flash[:alert] = "#{@object} wurde als abgelaufen markiert."
      when 'remove'
        @object.remove!
        flash[:alert] = "#{@object} wurde deaktiviert."
      when 'reactivate'
        @object.reactivate!
        flash[:alert] = "#{@object} wurde wieder aktiviert. (E-Mail an '#{@object.email} um )'"
      when 'resend_info'
        @object.resend_info
        flash[:alert] = "Ein Aktivierungscode wurde an '#{@object.email}' um #{Time.now.strftime('%d.%m.%Y um %M:%H Uhr')} gesendet."
      else
        workflow_changes = false
    end
    if workflow_changes
      redirect_to :action => :index, :workflow_state => @workflow_state
    else
      render :action => :edit
    end
  end

  def subscribe
    @object = UserRegistration.find(params[:id])
    @object.newsletter_signup = true
    @object.save
    render_newsletter
  end

  def unsubscribe
    object
    @object.newsletter_signup = false
    @object.save
    render_newsletter
  end

  private

=begin
  def object
    @object = UserRegistration.find(params[:id])
    @user_account = @object.user_account
    @user = @user_account ? @user_account.user : nil
    @user_registration = @object
  end
=end

  def collection
    filters = {}
    conditionals = []
    condition_args = []
    # workflow state
    filters['workflow_state'] = params[:workflow_state]
    unless filters['workflow_state'].blank?
      conditionals << "workflow_state = '#{@workflow_state}'" + (filters['workflow_state'] == "unchecked" ? " OR workflow_state IS NULL" : "")
    end
    @workflow_state = filters['workflow_state'] || 'all'
    # user last_name
    %(last_name first_name).each do |name_part|
      filters[name_part] = params[name_part.to_sym]
      unless filters[name_part].blank?
        conditionals << "#{name_part} LIKE ?"
        condition_args << filters[name_part] + '%'
      end
    end
    conditions = [ conditionals.join('AND') ] + condition_args
    @user_registrations = UserRegistration.find(:all, :conditions => conditions, :order => "created_at DESC")
  end

  def render_newsletter
    respond_to do |format|
      format.html do
        if request.referer.blank?
          render :nothing => true
        else
          redirect_to request.referer
        end
      end
      format.js do
        render :update do |page|
          page.replace 'newsletter_subscription_status', :partial => 'newsletter', :object => @object
        end
      end
    end
  end

end
