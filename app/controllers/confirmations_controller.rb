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
    return fallback_path if uri.scheme && (!%w[http https].include?(uri.scheme) || uri.host.blank?)
    return fallback_path if uri.userinfo.present?

    # Allow absolute redirects only for trusted tenant hosts.
    if uri.host.present? && !trusted_redirect_host?(uri.host)
      return fallback_path
    end

    # Require an absolute-path component to block malformed or scheme-only URLs.
    return fallback_path if uri.path.blank? || !uri.path.start_with?('/')

    # Keep search filters, but do not carry session guards or authentication tokens.
    query = Rack::Utils.parse_nested_query(uri.query)
    query.except!('checked_ohd_session', 'access_token', 'confirmation_token', 'reset_password_token')
    uri.query = query.to_query.presence
    uri.fragment = nil
    uri.to_s
  rescue URI::InvalidURIError, Rack::QueryParser::ParameterTypeError, Rack::QueryParser::QueryLimitError, ArgumentError
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
