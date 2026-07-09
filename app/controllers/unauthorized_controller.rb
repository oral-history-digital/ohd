class UnauthorizedController < Devise::FailureApp

  def respond
    if request.format.json?
      json_api_error_response
    else
      super
    end
  end

  def json_api_error_response
    self.status        = 401
    self.content_type  = 'application/json'
    self.response_body = { errors: [{ message: i18n_message }] }.to_json
  end

  private

  # Devise::FailureApp only inherits class-level default_url_options, so the
  # locale that ApplicationController appends per request never reaches the
  # redirect to the sign-in page, which lives under scope "/:locale".
  def default_url_options(options = {})
    options.merge(locale: I18n.locale)
  end
end
