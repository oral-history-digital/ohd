
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

    config.active_job.queue_adapter = :delayed_job

    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]
    config.i18n.default_locale = :de
    config.autoload_paths << Rails.root.join('lib')

    PROJECT = :zwar # can be :zwar or :hagen or :mog
    #PROJECT = ENV["ARCHIVE_PROJECT_NAME"].to_sym
    config.x.project = PROJECT
    config.project = config_for("projects/#{PROJECT}")

    config.i18n.available_locales = config.project["available_locales"]
  end
end
