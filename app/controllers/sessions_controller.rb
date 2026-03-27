class SessionsController < Devise::SessionsController
  include SignInRedirect

  skip_before_action :require_no_authentication
  skip_before_action :check_ohd_session
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  before_action :set_project, only: [:new, :create, :is_logged_in, :verify_otp, :otp]
  before_action :set_path, only: [:new, :create, :is_logged_in, :verify_otp, :otp]
  before_action :set_locale, only: [:new, :create, :is_logged_in, :verify_otp, :otp]

  respond_to :json, :html

  layout 'login'

  def is_logged_in
    redirect_to last_token ?
      url_with_access_token :
      join_params(url_with_access_token, "checked_ohd_session=true")
  end

  def new
    if current_user
      redirect_to url_with_access_token
    else
      if request.base_url == OHD_DOMAIN
        super
      else
        project = Project.by_domain(request.base_url)
        path = stored_location_for(:user)&.gsub("?checked_ohd_session=true", "")
        redirect_to "#{OHD_DOMAIN}#{new_user_session_path}?project=#{project.shortname}&path=#{path}"
      end
    end
  end

  def create
    self.resource = warden.authenticate(scope: resource_name)

    if resource
      if resource.otp_required_for_login? || resource.passkey_required_for_login?
        session[:otp_user_id] = resource.id
        sign_out(resource) # important
        redirect_to users_otp_path(project: @project.shortname, path: @path, locale: @locale)
      else
        sign_in(resource_name, resource)
        after_sign_in(resource)
      end
    else
      flash.now[:alert] = tv("devise.failure.#{warden.message || :invalid}")
      render :new, status: :unprocessable_entity
    end
  rescue BCrypt::Errors::InvalidHash
    respond_with(resource, location: url_with_access_token) do |format|
      format.json {
        render json: {error: 'change_to_bcrypt', email: params['user_account']['login']}
      }
    end    
  end


  def verify_otp
    # Second step:  verify OTP
    resource = User.find_by(id: session[:otp_user_id])
    
    if resource.nil? 
      redirect_to new_user_session_path, alert: tv("devise.failure.unauthenticated")
      return
    end

    if resource.validate_and_consume_otp!(params[:otp_attempt]) ||
      resource.verify_email_otp(params[:otp_attempt])

      resource.clear_email_otp!
      resource.reset_failed_attempts! if resource.respond_to?(:reset_failed_attempts!)
      session.delete(:otp_user_id)
      sign_in(resource_name, resource)
      yield resource if block_given?
      after_sign_in(resource)
    else
      resource.increment_failed_attempts if resource.respond_to?(:increment_failed_attempts)
      resource.lock_access! if resource.respond_to?(:lock_access!) && resource.failed_attempts >= resource.class.maximum_attempts
      if resource.access_locked?
        flash[:alert] = tv('devise.failure.locked')
        #render :otp, status: :unprocessable_entity
        redirect_to new_user_session_path
      else
        flash.now[:alert] = tv('devise.failure.invalid_otp')
        render :otp, status: :unprocessable_entity
      end
    end
  end

  def otp
    # Show OTP input form
    @user = User.find_by(id: session[:otp_user_id])
    redirect_to new_user_session_path, alert: tv("devise.failure.unauthenticated") if @user.nil? 
  end

  def resend_otp
    user = User.find_by(id: session[:otp_user_id])
    if user
      user.send_new_otp_code
      flash.now[:notice] = tv("sent_otp_per_mail")
      render :otp
    else
      redirect_to new_user_session_path, alert: tv("devise.failure.unauthenticated")
    end
  end

  def destroy
    current_user.access_tokens.destroy_all
    current_user.sessions.destroy_all
    sign_out
    respond_to_on_destroy
  end

  private

  def set_locale
    @locale = params[:locale]
    I18n.locale = @locale if @locale
  end
end
