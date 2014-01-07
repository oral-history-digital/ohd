class Admin::UserRegistrationsController < Admin::BaseController

  def index
    collection
    respond_to do |format|
      format.html do
        render
      end
      format.js do
        render :layout => false
      end
      format.csv do
        response.headers['Pragma'] = 'no-cache'
        response.headers['Cache-Control'] = 'no-cache, must-revalidate'
        response.headers['Content-Type'] = 'text/comma-separated-values'
        fields = %w(appellation first_name last_name email job_description organization country state street zipcode city workflow_state created_at newsletter_signup)
        csv = [fields.map{|f| translate_field_or_value(f) }.join("\t")]
        @user_registrations.each do |r|
          r_csv = []
          fields.each do |f|
            r_csv << translate_field_or_value(f, r.send(f.to_sym) || '').gsub(/[,;]+/,'')
          end
          csv << r_csv.join("\t")
        end
        send_data(csv.join("\n"),
                  { :filename => "Nutzer-#{@filters.keys.map{|k| translate_field_or_value(k, @filters[k])}.join("_")}-#{Time.now.strftime('%d.%m.%Y')}.csv",
                    :disposition => 'attachment',
                    :type => 'text/comma-separated-values' })
      end
    end
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
    @filters = {}
    conditionals = []
    condition_args = []
    # workflow state
    @filters['workflow_state'] = params['workflow_state'] || 'unchecked'
    unless @filters['workflow_state'].blank? || @filters['workflow_state'] == 'all'
      conditionals << "(workflow_state = '#{@filters['workflow_state']}'" + (@filters['workflow_state'] == "unchecked" ? " OR workflow_state IS NULL)" : ")")
    end
    @filters['workflow_state']
    # user name
    %w(last_name first_name).each do |name_part|
      @filters[name_part] = params[name_part]
      unless @filters[name_part].blank?
        conditionals << "#{name_part} LIKE ?"
        condition_args << @filters[name_part] + '%'
      end
    end
    # job description etc
    %w(job_description state research_intentions country).each do |info_part|
      @filters[info_part] = params[info_part]
      unless @filters[info_part].blank? || @filters[info_part] == 'all'
        conditionals << "application_info LIKE ?"
        condition_args << "%#{info_part}: #{ActiveRecord::Base.connection.quote(@filters[info_part])[1..-2]}%"
      end
    end
    @filters = @filters.delete_if{|k,v| v.blank? || v == 'all' }
    conditions = [ conditionals.join(' AND ') ] + condition_args
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

  def translate_field_or_value(field, value=nil)
    if value.nil?
      t(field, :scope => 'devise.registration_fields', :locale => :de)
    else
      if value.is_a?(Time)
        return value.strftime('%d.%m.%Y %H:%M Uhr')
      end
      if value.blank?
        return ''
      end
      if value
        return 'ja'
      end
      value.strip! if value.is_a?(String)
      scope = case field
                when 'last_name', 'first_name', 'email', 'organization', 'street', 'zipcode', 'city'
                  value
                when 'country'
                  return value if value.length > 2
                  'countries'
                when 'workflow_state'
                  'devise.workflow_states'
                else
                  'devise.registration_values.' + field.to_s
              end
      t(value, :scope => scope, :locale => :de)
    end
  end

end
