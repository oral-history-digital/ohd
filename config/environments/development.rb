require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Enable server timing
  config.server_timing = true

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable/disable caching. By default caching is disabled.
  if Rails.root.join('tmp/caching-dev.txt').exist?
    config.action_controller.perform_caching = true

    #config.cache_store = :redis_cache_store, { url: ENV['REDIS_URL'] }
    config.cache_store = :file_store, "#{Rails.root}/tmp/cache/application/"
    #config.cache_store = :memory_store
    #config.public_file_server.headers = {
      #'Cache-Control' => 'public, max-age=172800'
    #}
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false
  config.action_mailer.delivery_method = :test
  config.action_mailer.perform_caching = false
  config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Store files locally.
  config.active_storage.service = :dev

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Optional in development: only enable explicit AR encryption keys when all are provided.
  encryption_keys = {
    primary_key: ENV['ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY'].presence,
    deterministic_key: ENV['ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY'].presence,
    key_derivation_salt: ENV['ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT'].presence
  }

  provided_count = encryption_keys.values.compact.size
  if provided_count == encryption_keys.size
    config.active_record.encryption.primary_key = encryption_keys[:primary_key]
    config.active_record.encryption.deterministic_key = encryption_keys[:deterministic_key]
    config.active_record.encryption.key_derivation_salt = encryption_keys[:key_derivation_salt]
  elsif provided_count.positive?
    raise 'Set all ACTIVE_RECORD_ENCRYPTION_* variables or none in development.'
  end

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  #config.assets.debug = true

  # Suppress logger output for asset requests.
  #config.assets.quiet = true

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  # config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  allowed_domains = YAML.load_file(Rails.root.join('config/allowed_domains.yml')).fetch(Rails.env, [])
  extra_hosts = ENV.fetch('OHD_EXTRA_HOSTS_DEVELOPMENT', '').split(',').map(&:strip).reject(&:blank?)

  config.hosts = (allowed_domains + extra_hosts).uniq
end
