class SessionsController < Devise::SessionsController  

  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  #clear_respond_to 
  respond_to :json, :html

  def create
    super
  rescue BCrypt::Errors::InvalidHash
    respond_to do |format|
      format.json {
        render json: {error: 'change_to_bcrypt', email: params['user_account']['email']}
      }
    end
  end

end
