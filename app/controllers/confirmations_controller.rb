class ConfirmationsController < Devise::ConfirmationsController
  skip_after_action :verify_authorized
  skip_after_action :verify_policy_scoped

  def show
    super do |resource|
      if resource.errors.empty?
        resource.afirm! # workflow
        Doorkeeper::AccessToken.create!(resource_owner_id: resource.id)
        sign_in(resource)
      end
    end
  end

  protected

  def after_confirmation_path_for(resource_name, resource)
    fallback_path = "/#{resource.default_locale || I18n.default_locale}"
    return fallback_path if resource.pre_register_location.blank?

    uri = URI.parse(resource.pre_register_location)

    # Allow absolute redirects only for trusted tenant hosts.
    if uri.host.present? && !trusted_redirect_host?(uri.host)
      return fallback_path
    end

    # Require an absolute-path component to block malformed or scheme-only URLs.
    return fallback_path if uri.path.blank? || !uri.path.start_with?('/')

    if uri.host.present?
      # Drop query/fragment so untrusted params do not survive the redirect.
      uri.query = nil
      uri.fragment = nil
      return uri.to_s
    end

    uri.path
  rescue URI::InvalidURIError
    fallback_path
  end 

  def trusted_redirect_host?(host)
    trusted_hosts = [request.host]

    trusted_hosts << URI.parse(OHD_DOMAIN).host
    trusted_hosts.concat(
      Project.archive_domains.filter_map { |domain| URI.parse(domain).host }
    )

    trusted_hosts.uniq.include?(host)
  rescue URI::InvalidURIError
    false
  end

end
