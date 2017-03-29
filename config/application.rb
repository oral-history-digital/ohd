require File.expand_path('../boot', __FILE__)

require 'rails/all'


#Bundler.require(:default, Rails.env) if defined?(Bundler)

# Be sure to restart your server when you modify this file

# Specifies gem version of Rails to use when vendor/rails is not present
#RAILS_GEM_VERSION = '3.0.6' unless defined? RAILS_GEM_VERSION


if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  #Bundler.require(*Rails.groups(:assets => %w(development test)))
  #Bundler.require(:default, Rails.env) if defined?(Bundler)
  # If you want your assets lazily compiled in production, use this line
  # Bundler.require(:default, :assets, Rails.env)
end


#AUTHORIZATION_MIXIN = "items and groups"

module Archive
  class Application < Rails::Application
  # Settings in config/environments/* take precedence over those specified here.
  # Application configuration should go into files in config/initializers
  # -- all .rb files in that directory are automatically loaded.

  # Add additional load paths for your own custom dirs
  config.autoload_paths += %W(#{Rails.root}/lib/search_filters.rb)
  config.autoload_once_paths += %W( #{Rails.root}/lib/search_filters.rb )

  config.default_url_options ={ :locale => I18n.locale }


  #config.gem 'resource_controller'




  # CeDiS.config.__configure(:storage_dir, File.join(CeDiS.config.cifs_share, 'archiv_backup'))

  # CeDiS.config.__configure(:photo_storage_dir, File.join(CeDiS.config.storage_dir, 'bilder'))
  # CeDiS.config.__configure(:archive_management_dir, File.join(CeDiS.config.storage_dir, 'redaktionssystem'))
  # CeDiS.config.__configure(:repository_dir, File.join(CeDiS.config.storage_dir, 'archiv_dis'))
  #
  # "#{CeDiS.config.project_shortname}-Benutzerstatistik"
  # CeDiS.config.external_links[page_token.to_s][I18n.locale.to_s]
  # CeDiS.archive_facet_category_ids.map(&:to_s)
  # CeDiS.is_category?(key)
  # CeDiS.config.project_initials.downcase
  # CeDiS.config.project_initial
  # CeDiS.archive_facet_category_ids




  # Gem configuration (config.gem ...): We use bundler, please place gem configuration into the Gemfile.

  # Only load the plugins named here, in the order given (default is alphabetical).
  # :all can be used as a placeholder for all plugins not explicitly named
  # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

  # Skip frameworks you're not going to use. To use Rails without a database,
  # you must remove the Active Record framework.
  # config.frameworks -= [ :active_record, :active_resource, :action_mailer ]

  # Activate observers that should always be running
  # config.active_record.observers = :cacher, :garbage_collector, :forum_observer

  # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
  # Run "rake -D time" for a list of tasks for finding time zone names.
  config.time_zone = 'UTC'
  config.encoding = "utf-8"

  # The default locale is :de and all translations from config/locales/*.rb,yml are auto loaded.
  # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}')]
  #require 'i18n'
  I18n.enforce_available_locales = false
  config.i18n.available_locales =[:de]# CeDiS.config.available_locales.map(&:to_sym)
  config.i18n.default_locale = :de# CeDiS.config.default_locale.to_sym

  # I18n for JS
  #config.middleware.use "SimplesIdeias::I18n::Middleware"


  # RailsLTS config
  #config.rails_lts_options = { :default => :compatible }
  end
end