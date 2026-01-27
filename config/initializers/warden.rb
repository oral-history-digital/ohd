Rails.application.config.to_prepare do
  # Fires after user is set in session (any authentication method)
  Warden::Manager.after_set_user do |user, auth, opts|
    if opts[:scope] == :user && user.is_a?(User) &&
        opts[:event] == :authentication
      user.post_authentication_setup
    end
  end
  
  # Fires after successful authentication
  Warden::Manager.after_authentication do |user, auth, opts|
    # Only on fresh authentication, not session restoration
  end
  
  # Fires before logout
  Warden::Manager.before_logout do |user, auth, opts|
    # Clean up before user is logged out
  end
  
  # Fires before authentication failure
  Warden::Manager.before_failure do |env, opts|
    # env:  Rack environment
    # opts: failure options
  end
end
