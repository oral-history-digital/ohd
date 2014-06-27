# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => "_#{CeDiS.config.project_shortname}_archive_session",
  :secret      => 'bf9ca82860148d9b0718be4f70d811f674d18ac16cb70d1b137af30a57c61c65d1fc01ec484e47ceffae4a3d77e295ccd38b88c364f2e9b9cedbc4ba3e31e48d'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
