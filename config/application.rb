
require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Archive
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.active_storage.content_types_to_serve_as_binary -= ['image/svg+xml']
    config.active_job.queue_adapter = :delayed_job
    config.action_cable.mount_path = '/cable'

    config.autoload_paths << Rails.root.join('lib')

    config.mapping_to_ascii = config_for("mapping_to_ascii")
    config.project = config_for("project")
    config.datacite = config_for("datacite")

    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]
    config.i18n.available_locales = config.project["available_locales"] || [:en, :de, :ru, :el, :es]
    config.i18n.default_locale = config.project["default_locale"].try(:to_sym) || :de || config.i18n.default_locale
    config.i18n.fallbacks = [:en, :de, :ru, :el, :es]

    config.time_zone = "Berlin"
    config.active_record.time_zone_aware_types = [:datetime, :time]
  end
end
