class UserRegistrationsController < ApplicationController
  include Devise::Controllers::Helpers

  skip_before_action :authenticate_user_account!
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  respond_to :json, :html
  layout 'responsive'

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
        UserAccountMailer.with(user_account: @user_registration.user_account).account_activation_instructions.deliver
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

    @user_account.confirm!(password, password_confirmation)
    if @user_account.errors.empty?
      @user_account.reset_password_token = nil
      flash[:alert] = t('welcome', :scope => 'devise.registrations')
      sign_in(:user_account, @user_account)
      respond_with @user_account, location: after_sign_in_path_for(@user_account)
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
    params.require(:user_registration).permit(:appellation, :first_name, :last_name, :email, :job_description, :research_intentions, :comments, :organization, :homepage, :street, :zipcode, :city, :state, :country, :receive_newsletter, :tos_agreement, :priv_agreement, :default_locale)
  end

end
