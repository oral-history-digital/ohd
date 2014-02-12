# Settings specified here will take precedence over those in config/environment.rb

config.middleware.use 'Rack::Maintenance',
   :file => Rails.root.join('tmp', 'maintenance.html')

# Path Prefix for demo deployment on FnF
config.action_controller.relative_url_root = '/archiv'

# The production environment is meant for finished, "live" apps.
# Code is not reloaded between requests
config.cache_classes = true

# Full error reports are disabled and caching is turned on
config.action_controller.consider_all_requests_local = false
# set this to false temporarily - the stylesheet and javascript
# includes don't seem to work perfectly with a relative_url_root
config.action_controller.perform_caching             = true
config.action_view.cache_template_loading            = true

# See everything in the log (default is :info)
# config.log_level = :debug

# Use a different logger for distributed setups
# config.logger = SyslogLogger.new

# Use a different cache store in production
config.cache_store = :file_store, 'tmp/cache'

# Enable serving of images, stylesheets, and javascripts from an asset server
# config.action_controller.asset_host = "http://assets.example.com"

# Disable delivery errors, bad email addresses will be ignored
# config.action_mailer.raise_delivery_errors = false

# Enable threaded mode
# config.threadsafe!

# Exception Notifier Recipients
SERVER_HOST = Socket.gethostname

ActionMailer::Base.smtp_settings = {
    :address => 'mail.fu-berlin.de',
    :port => 25,
    :domain => 'zwangsarbeit-archiv.de'
}

config.action_mailer.default_url_options = {
    :host => 'zwangsarbeit-archiv.de'
}
config.action_mailer.delivery_method = :smtp

config.after_initialize do
  ExceptionNotification::Notifier.exception_recipients = %w(jerico.dev@gmail.com)
  ExceptionNotification::Notifier.sender_address = 'team@zwangsarbeit-archiv.de'
  ExceptionNotification::Notifier.email_prefix = '[ERROR] '
end
