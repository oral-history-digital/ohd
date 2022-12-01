class AccountsController < ApplicationController

  skip_before_action :authenticate_user_account!, only: [:show]
  skip_after_action :verify_authorized, only: [:show]
  skip_after_action :verify_policy_scoped, only: [:show]

  def show
    respond_to do |format|
      format.html {}
      format.json do
        render json: {
          id: 'current',
          data_type: 'accounts',
          data: current_user_account && ::UserAccountSerializer.new(current_user_account)
        }
      end
    end
  end

  def update
    authorize(current_user_account)
    current_user_account.update account_params
    # FIXME: we have to update duplicated data here
    current_user_account.user_registration.update account_params
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
    authorize(user_account)
    if user_account.confirmation_token == params[:confirmation_token]
      user_account.confirm
      redirect_to account_url('current')
    else
      raise 'confirmation_token does not fit!!'
    end
  end

  def index
    accounts = policy_scope(UserAccount)

    respond_to do |format|
      format.json do
        json = Rails.cache.fetch "#{current_project.cache_key_prefix}-admin-accounts-#{UserAccount.maximum(:updated_at)}" do
          {
            data: (accounts - [current_user_account]).inject({}){|mem, s| mem[s.id] = cache_single(s); mem},
            data_type: 'accounts'
          }
        end
        render json: json
      end
    end
  end

  private

  def account_params
    params.require(:account).permit(:email, :first_name, :last_name)
  end

end
