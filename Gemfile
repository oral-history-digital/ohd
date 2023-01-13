#source 'https://dev.cedis.fu-berlin.de/geminabox/'
source 'https://rubygems.org'

#ruby '2.6.6'

gem 'rdoc'
gem 'rails', '~> 7.0.0'
gem 'mysql2'
gem "redis", "~> 4.0"
#gem 'exception_notification'
gem 'pundit'
gem 'workflow'
#gem 'i18n-js'
gem 'jquery-rails'
gem 'jquery-ui-rails'
#gem 'i18n'
gem 'will_paginate', '3.1.7'
gem 'mini_magick'
gem 'mini_exiftool'
gem 'image_processing', '~> 1.2'
gem 'mime-types'
gem 'globalize'
gem 'activemodel-serializers-xml'
gem 'nokogiri'
gem 'fastercsv'
gem 'roo', "~> 2.7.0"
gem 'henkei'
gem 'webvtt-ruby'
gem 'oai_repository', git: 'https://github.com/grgr/oai_repository'
gem 'delayed_job_active_record'
gem 'daemons'
gem 'open4'
gem 'cyrillizer'
gem 'active_model_serializers', '~> 0.10.13'
gem 'rails-latex'
gem 'webpacker', '~> 5.4.3'
gem 'react_on_rails', '~> 11.3.0'
gem 'slim-rails'
gem 'iso-639'
gem 'countries'
gem 'font-awesome-rails'
gem 'rack-brotli', '~> 1.0'
gem 'rack-cors'
gem 'sprockets-rails'

# Gems specific to public archive app:
gem 'unicode'
gem 'acts_as_taggable_on_steroids'
#gem 'localized_country_select'
#gem 'route_translator'
gem 'devise'
gem 'doorkeeper'
gem 'rack-maintenance'
gem 'celluloid'
gem 'sunspot_rails', '~> 2.6.0'
gem 'sunspot_solr', '~> 2.6.0'
gem 'progress_bar'


group :test, :development do
  gem 'cypress-on-rails', '~> 1.0'
  gem "byebug", "~> 11.1"
  gem 'bcrypt_pbkdf'
  gem 'ed25519'
end

group :development do
  # Automatic tests
  gem 'rails-erd'
  gem 'guard-spork'
  gem 'guard-rspec'
  gem 'guard-cucumber'
  gem 'capistrano', '~> 3.17.0'
  gem 'capistrano3-delayed-job', '~> 1.0'
  gem 'capistrano-rbenv'
  gem 'capistrano-rails'
  gem 'capistrano-passenger'
  gem 'puma'
  gem 'foreman'
  gem 'rb-readline'
  gem 'pry'
  #gem 'meta_request'
end

#
group :test do
  gem 'rspec', '~> 3.10.0'
  gem 'rspec-rails', '~> 4.0.2'
  gem 'rspec-snapshot', '~> 0.1.2'
  # Faster tests:
  gem 'spork'
  gem 'pdf-inspector', require: "pdf/inspector"
  gem 'pdf-reader'
  #gem 'rest-client'
  #gem 'json'
  #gem 'pry'
  gem 'factory_bot'
  gem 'factory_bot_rails'
  gem 'rspec-activemodel-mocks'
  gem 'simplecov'
  # Integration tests:
  #gem 'capybara'
  #gem 'selenium-webdriver'
  #gem 'database_cleaner'
  #gem 'email_spec'
end

group :production do
  gem 'execjs'
  gem 'uglifier'
end

gem 'mini_racer', platforms: :ruby
