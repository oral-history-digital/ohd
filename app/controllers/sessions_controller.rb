class SessionsController < Devise::SessionsController  

  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  #clear_respond_to 
  respond_to :json, :html

end
