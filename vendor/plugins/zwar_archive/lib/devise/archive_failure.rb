class Devise::ArchiveFailure < Devise::FailureApp
  include ActionController::UrlWriter

  # This overwrites the normal behaviour: ArchiveAuthentication
  # authenticates setting a user/user_account scope alternatively.
  # Thus location storage and redirects need to be scope-agnostic.
  def respond!
    options = @env['warden.options']

    redirect_path = anmelden_path
    query_string = query_string_for(options)
    store_location!(:user_account)

    headers = {}
    headers["Location"] = redirect_path
    headers["Location"] << "?" << query_string unless query_string.empty?
    headers["Content-Type"] = 'text/plain'

    [302, headers, ["You are being redirected to #{redirect_path}"]]
  end

end
