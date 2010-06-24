class UserRegistrationsController < ResourceController::Base
  include Devise::Controllers::Helpers

  actions :new, :create

  create do
    before do
      puts "\n@@@@ USER REGISTRATION:"
      puts "PARAMS: #{object_params.inspect}"
      puts object.inspect
    end
    wants.html do
      render :action => 'submitted'
    end
  end

  create.flash I18n.t(:successful, :scope => 'devise.registrations')

  # GET /zugang_aktivieren/:confirmation_token
  def activate
    account_for_token(params[:confirmation_token])

    if !@user_account.nil? && @user_account.errors.empty?
      @user_account.send(:generate_reset_password_token)
      @user_account.save
    else
      flash[:alert] = @user_account.nil? ? t('invalid_token', :scope => 'devise.confirmations') : @user_account.errors.full_messages
      redirect_to anmelden_url
    end
  end

  # POST /zugang_aktivieren/:confirmation_token
  def confirm_activation
    # don't clear the confirmation_token until we have successfully
    # submitted the password
    account_for_token(params[:confirmation_token])
    @user_account.reset_password!(params['user_account']['password'], params['user_account']['password_confirmation']) unless @user_account.nil? || params['user_account'].blank?

    if !@user_account.nil? && @user_account.errors.empty?
      @user_account.reset_password_token = nil
      @user_account.confirm!
      flash[:alert] = t('welcome', :scope => 'devise.registrations')
      sign_in_and_redirect(:user_account, @user_account)
    else
      flash[:alert] = t('invalid_token', :scope => 'devise.confirmations') if @user_account.nil?
      render :action => :activate
    end
  end

  private

  def account_for_token(confirmation_token)
    puts "\n\n@@@ PARAMS:\n#{params.inspect}\n\n"
    @user_account = UserAccount.find_by_confirmation_token(params[:confirmation_token], :include => :user_registration)
  end
  
end