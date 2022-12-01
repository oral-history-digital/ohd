class UserRegistrationsController < ApplicationController
  include Devise::Controllers::Helpers

  skip_before_action :authenticate_user_account!, only: [:new, :create, :activate, :confirm, :index]
  skip_after_action :verify_authorized, only: [:new, :create, :activate, :confirm]
  skip_after_action :verify_policy_scoped, only: [:new, :create, :activate, :confirm]

  respond_to :json, :html

  def new
    @user_registration = UserRegistration.new
    respond_to do |format|
      format.html do
        render :template => '/react/app'
      end
    end
  end

  def create
    @user_registration = UserRegistration.new(user_registration_params)
    if @user_registration.save
      UserRegistrationProject.create project_id: current_project.id, user_registration_id: @user_registration.id if current_project
      @user_registration.register
      render json: {registration_status: render_to_string("submitted.#{params[:locale]}.html", layout: false)}
    elsif !@user_registration.errors[:email].nil? && @user_registration.email =~ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      @user_registration = UserRegistration.where(email: @user_registration.email).first
      if @user_registration.user_account
        # re-send the activation instructions
        @user_registration.user_account.resend_confirmation_instructions
        @email = @user_registration.email
      end
      render json: {registration_status: render_to_string("registered.#{params[:locale]}.html", layout: false)}
    else
      @email = @user_registration.email
      @user_registration = nil
      render json: {registration_status: render_to_string("registered.#{params[:locale]}.html", layout: false)}
    end
  end

  # GET
  def activate
    # here the confirmation_token is passed as :id
    account_for_token(params[:id])
    @project = current_project

    if !@user_account.nil? && @user_account.errors.empty?
      @login = @user_account.login
      @display_name = @user_account.display_name
      @active = @user_account.active?
    else
      @registration_status = t('invalid_token', :scope => 'devise.confirmations')
    end
  end

  # POST
  # is this used only for password change???
  def confirm
    # don't clear the confirmation_token until we have successfully
    # submitted the password
    # here the confirmation_token is passed as :id
    account_for_token(params[:id])
    password = params['user_account'].blank? ? nil : params['user_account']['password']
    password_confirmation = params['user_account'].blank? ? nil : params['user_account']['password_confirmation']
    @project = current_project

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
    @project = current_project
    @user_registration = UserRegistration.find(params[:id])
    authorize @user_registration
    @user_registration.update_attributes(user_registration_params)

    respond_to do |format|
      format.json do
        render json: data_json(@user_registration, msg: 'processed')
      end
    end
  end

  def index
    page = params[:page] || 1
    user_registrations = policy_scope(UserRegistration).
      where(search_params).
      order("last_name ASC").
      paginate(page: page)

    total_pages = user_registrations.total_pages
    user_registrations = user_registrations.includes(:user_registration_projects).
      inject({}){|mem, s| mem[s.id] = UserRegistrationSerializer.new(s); mem}

    update_initial_redux_state(user_registrations)
    extra_params = search_params.update(page: page).inject([]){|mem, (k,v)| mem << "#{k}_#{v}"; mem}.join("_")

    respond_to do |format|
      format.html { render 'react/app' }
      format.json do |format|
        render json: {
          data: user_registrations,
            data_type: 'user_registrations',
            extra_params: extra_params,
            page: params[:page],
            result_pages_count: total_pages
          }
      end
      format.csv do
        response.headers['Pragma'] = 'no-cache'
        response.headers['Cache-Control'] = 'no-cache, must-revalidate'
        response.headers['Content-Type'] = 'text/comma-separated-values'
        fields = %w(appellation first_name last_name email job_description organization country street zipcode city created_at)
        csv = [fields.map{|f| translate_field_or_value(f) }.join("\t")]
        user_registrations.each do |r|
          r_csv = []
          fields.each do |f|
            r_csv << translate_field_or_value(f, r.send(f.to_sym) || '').gsub(/[,;]+/,'')
          end
          csv << r_csv.join("\t")
        end
        send_data(csv.join("\n"),
                  { :filename => "Nutzer-#{search_params.keys.map{|k| translate_field_or_value(k, search_params[k])}.join("_")}-#{Time.now.strftime('%d.%m.%Y')}.csv",
                    :disposition => 'attachment',
                    :type => 'text/comma-separated-values' })
      end
    end
  end

  def initial_user_registration_redux_state
    initial_redux_state.update(
      account: initial_redux_state[:account].update(
        login: @login,
        display_name: @display_name,
        registration_status: @registration_status,
        active: @active
      )
    )
  end
  helper_method :initial_user_registration_redux_state

  private

  def account_for_token(confirmation_token)
    @user_account = UserAccount.includes(:user_registration).find_by(confirmation_token: confirmation_token)
  end

  def update_initial_redux_state(user_registrations)
    initial_redux_state.update(
      data: initial_redux_state[:data].update(
        user_registrations: user_registrations
      )
    )
  end

  def user_registration_params
    params.require(:user_registration).permit(
      :appellation,
      :first_name,
      :last_name,
      :email,
      :gender,
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
      :default_locale
    )
  end

  def search_params
    permitted = params.permit(
      :first_name,
      :last_name,
      :email,
      :default_locale,
      'user_registration_projects.workflow_state'
    ).to_h.select{|k,v| !(v.blank?) }
    permitted['user_registration_projects.workflow_state'] = 'account_confirmed' unless permitted['user_registration_projects.workflow_state']
    permitted.delete('user_registration_projects.workflow_state') if permitted['user_registration_projects.workflow_state'] == 'all'
    permitted
  end

end
