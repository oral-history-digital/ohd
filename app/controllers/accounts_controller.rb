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

end
