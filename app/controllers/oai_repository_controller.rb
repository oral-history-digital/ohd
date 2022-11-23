class OaiRegositoryController < OaiRepository::ServicesController

  skip_before_action :authenticate_user_account!
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

end

