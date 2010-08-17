class Admin::UserRegistrationsController < Admin::BaseController

  actions :index, :edit, :update

  update do
    before do
      @workflow_state = object.workflow_state
      # action dependent on submit value
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
          @object.resend_info!
          flash[:alert] = "Ein Aktivierungscode wurde an '#{@object.email}' um #{Time.now.strftime('%d.%m.%Y um %M:%H Uhr')} gesendet."
      end
    end
    wants.html do
      redirect_to :action => :index, :workflow_state => @workflow_state
    end
  end

  private

  def object
    @object = UserRegistration.find(params[:id])
    @user_account = @object.user_account
    @user = @user_account ? @user_account.user : nil
    @object
  end

  def collection
    @workflow_state = params[:workflow_state] || 'unchecked'
    conditions = "workflow_state = '#{@workflow_state}'" + (@workflow_state == "unchecked" ? " OR workflow_state IS NULL" : "")
    @user_registrations = UserRegistration.find(:all, :conditions => conditions, :order => "created_at DESC")
  end

end