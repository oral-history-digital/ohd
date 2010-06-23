class UserRegistrationsController < ResourceController::Base

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
    resource = UserAccount.confirm_by_token(params[:confirmation_token])

    if resource.errors.empty?
      flash[:notice] = 'gut!' # :confirmed
      sign_in(:user_account, resource)
      change_password_token = resource.send(:generate_reset_password_token)
      resource.save
      redirect_to edit_user_account_password_url(:reset_password_token => change_password_token)
    else
      puts resource.errors.full_messages
      flash[:notice] = resource.errors.full_messages
      redirect_to anmelden_url
    end
  end
  
end