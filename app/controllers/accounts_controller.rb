class AccountsController < BaseController

  layout 'responsive'

  def show
    respond_to do |format|
      format.html {}
      format.json { render json: current_user_account || {} }
    end
  end

end
