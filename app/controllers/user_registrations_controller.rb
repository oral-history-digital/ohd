class UserRegistrationsController < ApplicationController
  include Devise::Controllers::Helpers

  def new
    @user_registration = UserRegistration.new
  end

  def create
    @user_registration = UserRegistration.new(user_registration_params)
    if @user_registration.save
      flash[:notice] = I18n.t(:successful, :scope => 'devise.registrations')
      render :action => 'submitted'
    elsif !@user_registration.errors.on('email').nil? && @user_registration.email =~ Devise::EMAIL_REGEX
      @user_registration = UserRegistration.where(["email = ?", @user_registration.email]).first
      if @user_registration.checked?
        # re-send the activation instructions
        UserAccountMailer.account_activation_instructions(@user_registration, @user_registration.user_account).deliver
      end
      render :action => 'registered'
    else
      render :action => 'new'
    end
  end

  # GET 
  def activate
    # here the confirmation_token is passed as :id
    account_for_token(params[:id])

    if !@user_account.nil? && @user_account.errors.empty?
    else
      flash[:alert] = @user_account.nil? ? t('invalid_token', :scope => 'devise.confirmations') : @user_account.errors.full_messages
      redirect_to new_user_account_session_url
    end
  end

  # POST 
  def confirm
    # don't clear the confirmation_token until we have successfully
    # submitted the password
    # here the confirmation_token is passed as :id
    account_for_token(params[:id])
    #@user_account = UserAccount.find(params[:id])
    password = params['user_account'].blank? ? nil : params['user_account']['password']
    password_confirmation = params['user_account'].blank? ? nil : params['user_account']['password_confirmation']

    if @user_account.nil?
      flash[:alert] = t('invalid_token', :scope => 'devise.confirmations') if @user_account.nil?
      redirect_to new_user_account_session_url
    else
      @user_account.confirm!(password, password_confirmation)
      if @user_account.errors.empty?
        @user_account.reset_password_token = nil
        flash[:alert] = t('welcome', :scope => 'devise.registrations')
        sign_in_and_redirect(:user_account, @user_account)
      else
        error_type = case @user_account.errors.map { |e| e.first }.compact.first
                       when :password, 'password'
                         'password_missing'
                       when :password_confirmation, 'password_confirmation'
                         'password_confirmation_missing'
                       else
                         'invalid_token'
                     end
        flash[:alert] = t(error_type, :scope => 'devise.confirmations')
        render :action => :activate
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
    params.require(:user_registration).permit(:appellation, :first_name, :last_name, :email, :job_description, :research_intentions, :comments, :organization, :homepage, :street, :zipcode, :city, :state, :country, :receive_newsletter, :tos_agreement, :priv_agreement, :default_locale)
  end

end
