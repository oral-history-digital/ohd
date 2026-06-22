Sentry.init do |config|
  config.dsn = ENV['SENTRY_DSN'].presence ||
    Rails.application.credentials.dig(:sentry, :dsn)

  config.breadcrumbs_logger = [:active_support_logger, :http_logger]

  # Only send events to Sentry when a DSN is configured.
  config.enabled_environments = %w[production staging]

  # Add request data such as the URL and params to events.
  config.send_default_pii = true

  # Set traces_sample_rate to capture a percentage of transactions for
  # performance monitoring. Bugsink does not support traces, so 0.
  config.traces_sample_rate = 0
end
