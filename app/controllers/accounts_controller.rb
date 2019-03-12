class AccountsController < ApplicationController

  skip_before_action :authenticate_user_account!, only: [:show]
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  layout 'responsive'

  def show
    respond_to do |format|
      format.html {}
      #format.json { render json: current_user_account && ::UserAccountSerializer.new(current_user_account).to_json || {} }
      format.json do
        render json: current_user_account && {
          id: 'current',
          data_type: 'accounts',
          data: ::UserAccountSerializer.new(current_user_account)
        } || {} 
      end
    end
  end

  def update
    current_user_account.update_attributes account_params
    respond_to do |format|
      format.html {}
      format.json do
        render json: current_user_account && {
          id: 'current',
          data_type: 'accounts',
          data: ::UserAccountSerializer.new(current_user_account)
        } || {} 
      end
    end
  end

  def confirm_new_email
    # perhaps one should use current_user_account here instead of the following
    user_account = UserAccount.find(params[:id])
    if user_account.confirmation_token == params[:confirmation_token]
      user_account.confirm
      redirect_to account_url('current')
    else
      raise 'confirmation_token does not fit!!'
    end
  end

  private

  def account_params
    params.require(:account).permit(:email, :first_name, :last_name)
  end

end
