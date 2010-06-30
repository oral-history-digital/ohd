class Admin::UserRegistrationsController < Admin::BaseController

  actions :index, :edit, :update

  update do
    before do
      @workflow_state = object.workflow_state
      # action dependent on submit value
      case params['workflow_event']
        when 'register'
          @object.register!
        when 'postpone'
          @object.postpone!
        when 'reject'
          @object.reject!
        when 'activate'
          if @workflow_state.to_s == 'checked'
            flash[:alert] = 'Benutzer muss seinen Account selbst aktivieren um ein Passwort zu erhalten.'
          else
            @object.activate!
          end
        when 'expire'
          @object.expire!
        when 'remove'
          @object.remove!
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
    @user_registrations = UserRegistration.find(:all, :conditions => conditions)
  end

end