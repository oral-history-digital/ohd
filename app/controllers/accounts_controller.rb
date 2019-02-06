class AccountsController < ApplicationController
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  layout 'responsive'

  def show
    respond_to do |format|
      format.html {}
      format.json { render json: current_user_account && ::UserAccountSerializer.new(current_user_account).to_json || {} }
    end
  end

end
