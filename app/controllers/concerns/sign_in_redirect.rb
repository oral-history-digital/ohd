module SignInRedirect
  extend ActiveSupport::Concern

  private

  def set_project
    @project = Project.where(shortname: params[:project]).first || Project.ohd
  end

  def set_path
    # Remove internal loop-prevention flag before using path for redirects.
    @path = remove_checked_ohd_session(params[:path])
  end

  def url_with_access_token
    last_token ? join_params(url, "access_token=#{last_token}") : url
  end

  def url
    "#{!@project.archive_domain.blank? ? @project.archive_domain : OHD_DOMAIN}#{@path}"
  end

  def last_token
    current_user&.access_tokens&.last&.token
  end

  def join_params(base_url, params_string)
    "#{base_url}#{base_url.include?('?') ? '&' : '?'}#{params_string}"
  end

  def after_sign_in(resource)
    path = current_return_path(resource)
    if path
      # Cross-domain sign-ins start on OHD and must redirect to the project
      # domain with an access token for session handover.
      if request.base_url == OHD_DOMAIN && @project&.archive_domain.present?
        @path = path
        respond_with resource, location: url_with_access_token
      else
        respond_with resource, location: path
      end
    else
      respond_with resource, location: url_with_access_token
    end
  end

  def sign_in_redirect_url(resource)
    # JSON-based passkey flow needs the same redirect decision as HTML login.
    path = current_return_path(resource)
    if path
      if request.base_url == OHD_DOMAIN && @project&.archive_domain.present?
        @path = path
        url_with_access_token
      else
        path
      end
    else
      url_with_access_token
    end
  end

  def current_return_path(resource = nil)
    scope = if respond_to?(:resource_name, true)
      resource_name
    elsif resource
      resource.class.name.underscore.to_sym
    else
      :user
    end

    # Prefer explicit path from request, then Devise stored location.
    remove_checked_ohd_session(
      params[:path].presence || stored_location_for(scope)
    )
  end

  def remove_checked_ohd_session(path)
    return path if path.blank?

    # Strip internal guard param while preserving all user-facing query params.
    uri = URI.parse(path)
    return path if uri.query.blank?

    query = Rack::Utils.parse_nested_query(uri.query)
    query.delete('checked_ohd_session')
    uri.query = query.to_query.presence
    uri.to_s
  rescue URI::InvalidURIError
    path
  end
end
