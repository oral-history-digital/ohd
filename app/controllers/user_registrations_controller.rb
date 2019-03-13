class UserRegistrationsController < ApplicationController
  include Devise::Controllers::Helpers

  skip_before_action :authenticate_user_account!, only: [:new, :create, :activate, :confirm]
  skip_after_action :verify_authorized, only: [:new, :create, :activate, :confirm]
  skip_after_action :verify_policy_scoped, only: [:new, :create, :activate, :confirm]

  before_action :filter_user_registrations, only: [:index]

  respond_to :json, :html

  def new
    @user_registration = UserRegistration.new
    respond_to do |format|
      format.html do
        render :template => '/react/app.html'
      end
    end
  end

  def create
    @user_registration = UserRegistration.new(user_registration_params)
    if @user_registration.save
      AdminMailer.with(registration: @user_registration).new_registration_info.deliver
      render json: {registration_status: render_to_string("submitted.#{params[:locale]}.html", layout: false)}
    elsif !@user_registration.errors[:email].nil? && @user_registration.email =~ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      @user_registration = UserRegistration.where(email: @user_registration.email).first
      if @user_registration.checked?
        # re-send the activation instructions
        @user_registration.user_account.resend_confirmation_instructions
      end
      render json: {registration_status: render_to_string("registered.#{params[:locale]}.html", layout: false)}
    end
  end

  # GET 
  def activate
    # here the confirmation_token is passed as :id
    account_for_token(params[:id])

    if !@user_account.nil? && @user_account.errors.empty?
      @login = @user_account.login 
      @display_name = @user_account.display_name
      @active = @user_account.active?
    else
      @registration_status = t('invalid_token', :scope => 'devise.confirmations')
    end
  end

  # POST 
  def confirm
    # don't clear the confirmation_token until we have successfully
    # submitted the password
    # here the confirmation_token is passed as :id
    account_for_token(params[:id])
    password = params['user_account'].blank? ? nil : params['user_account']['password']
    password_confirmation = params['user_account'].blank? ? nil : params['user_account']['password_confirmation']

    @user_account.confirm_with_password!(password, password_confirmation)
    if @user_account.errors.empty?
      @user_account.reset_password_token = nil
      flash[:alert] = t('welcome', :scope => 'devise.registrations')
      sign_in(:user_account, @user_account)
      respond_with @user_account, location: after_sign_in_path_for(@user_account)
    end
  end

  def edit
    @user_registration = UserRegistration.find(params[:id])
    authorize @user_registration
  end

  def update
    @user_registration = UserRegistration.find(params[:id])
    authorize @user_registration
    @user_registration.update_attributes(user_registration_params)
    clear_cache @user_registration

    respond_to do |format|
      format.json do
        render json: data_json(@user_registration, msg: 'processed')
      end
    end
  end

  #def subscribe
    #@user_registration = UserRegistration.find(params[:id])
    #authorize @user_registration
    #@user_registration.newsletter_signup = true
    #@user_registration.save
  #end

  #def unsubscribe
    #@user_registration = UserRegistration.find(params[:id])
    #authorize @user_registration
    #@user_registration.newsletter_signup = false
    #@user_registration.save
  #end

  def index
    respond_to do |format|
      format.html { render 'react/app' }
      format.json do |format|
        extra_params = @filters.update(page: params[:page] || 1).inject([]){|mem, (k,v)| mem << "#{k}_#{v}"; mem}.join("_")
        render json: {
            data: @user_registrations.inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            data_type: 'user_registrations',
            extra_params: extra_params,
            page: params[:page], 
            result_pages_count: @user_registrations.total_pages
          }
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

  private

  def account_for_token(confirmation_token)
    # do not accidently return first user with confirmation_token == nil !!!
    unless confirmation_token.blank?
      @user_account = UserAccount.where(confirmation_token: confirmation_token).includes(:user_registration).first
    end
  end

  def user_registration_params
    params.require(:user_registration).permit(
      :appellation,
      :first_name,
      :last_name,
      :email,
      :job_description,
      :research_intentions,
      :comments,
      :organization,
      :homepage,
      :street,
      :zipcode,
      :city,
      :state,
      :country,
      :receive_newsletter,
      :tos_agreement,
      :priv_agreement,
      :default_locale,
      :workflow_state,
      :admin_comments
    )
  end

  def filter_user_registrations
    @filters = {}
    conditionals = []
    condition_args = []
    # workflow state
    @filters['workflow_state'] = params['workflow_state'] || 'unchecked'
    unless @filters['workflow_state'].blank? || @filters['workflow_state'] == 'all'
      conditionals << "(workflow_state = '#{@filters['workflow_state']}'" + (@filters['workflow_state'] == "unchecked" ? " OR workflow_state IS NULL)" : ")")
    end
    # other attributes
    %w(email default_locale).each do |att|
      @filters[att] = params[att]
      unless @filters[att].blank?
        conditionals << "#{att} = ?"
        condition_args << @filters[att]
      end
    end
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
    conditions = conditions.first if conditions.length == 1
    @user_registrations = policy_scope(UserRegistration).where(conditions).order("created_at DESC").paginate page: params[:page] || 1
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
