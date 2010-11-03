module AuthorizationHelper
  
  # check the authorization permission
  # identified by *action* symbol
  def authorized_to(action)
    raise "Illegal authorization '#{action}' referenced (legit authorizations are '#{AuthorizationPatch::AUTHORIZATION_ACTIONS.values.join("', '")}')." \
      unless AuthorizationPatch::AUTHORIZATION_ACTIONS.values.include?(action.to_sym)
    return false if @current_authorizations.nil?
    @current_authorizations[action.to_sym]
  end
  
end
