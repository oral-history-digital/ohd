# Settings specified here will take precedence over those in config/environment.rb

# Path Prefix for demo deployment on FnF
config.action_controller.relative_url_root = "/demo"

# The production environment is meant for finished, "live" apps.
# Code is not reloaded between requests
config.cache_classes = true

# Full error reports are disabled and caching is turned on
config.action_controller.consider_all_requests_local = false
# set this to false temporarily - the stylesheet and javascript
# includes don't seem to work perfectly with a relative_url_root
config.action_controller.perform_caching             = false
config.action_view.cache_template_loading            = true

# See everything in the log (default is :info)
# config.log_level = :debug

# Use a different logger for distributed setups
# config.logger = SyslogLogger.new

# Use a different cache store in production
# config.cache_store = :mem_cache_store

# Enable serving of images, stylesheets, and javascripts from an asset server
# config.action_controller.asset_host = "http://assets.example.com"

# Disable delivery errors, bad email addresses will be ignored
# config.action_mailer.raise_delivery_errors = false

# Enable threaded mode
# config.threadsafe!

# Exception Notifier Recipients
SERVER_HOST = Socket.gethostname

config.after_initialize do
  ExceptionNotifier.exception_recipients = %w(jrietema@cedis.fu-berlin.de jschmeisser@cedis.fu-berlin.de)
  ExceptionNotifier.sender_address = %("Application Error" <server@#{SERVER_HOST}>)
  ExceptionNotifier.email_prefix = "[ERROR] "
end
