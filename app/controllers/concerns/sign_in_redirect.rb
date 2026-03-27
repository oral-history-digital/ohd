module SignInRedirect
  extend ActiveSupport::Concern

  private

  def set_project
    @project = Project.where(shortname: params[:project]).first || Project.ohd
  end

  def set_path
    @path = params[:path]
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
    path = stored_location_for(resource)
    if path
      respond_with resource, location: path
    else
      respond_with resource, location: url_with_access_token
    end
  end

  def sign_in_redirect_url(resource)
    stored_location_for(resource) || url_with_access_token
  end
end
