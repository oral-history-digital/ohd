class Devise::ArchiveFailure < Devise::FailureApp
  include ActionController::UrlWriter

  # This overwrites the normal behaviour: ArchiveAuthentication
  # authenticates setting a user/user_account scope alternatively.
  # Thus location storage and redirects need to be scope-agnostic.
  def respond!
    options = @env['warden.options']
    query_string = query_string_for(options)
    query_string << '&' unless query_string.empty?

    store_location!(:user_account)

    headers = {
        "Location" => "#{anmelden_path}?#{query_string}locale=#{I18n.locale}",
        "Content-Type" => 'text/plain'
    }

    [302, headers, ["You are being redirected to #{headers['Location']}"]]
  end

end
