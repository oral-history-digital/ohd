#source 'https://dev.cedis.fu-berlin.de/geminabox/'
source 'https://rubygems.org'

ruby '2.5.3'

gem 'rdoc'
gem 'rails', '~>5.2.4'
gem 'mysql2'
gem "redis", "~> 4.0"
gem 'exception_notification'
gem 'pundit'
gem 'workflow'
gem 'i18n-js'
gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'i18n'
gem 'will_paginate', '3.1.7'
#gem 'rsolr'
gem 'mini_magick'
gem 'mini_exiftool'
gem 'image_processing', '~> 1.2'
gem 'mime-types'
gem 'globalize', git: 'https://github.com/globalize/globalize'
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
gem 'active_model_serializers', '~> 0.10.0'
gem 'rails-latex'
gem 'RedCloth'
gem 'sass-rails'
gem 'webpacker', '>= 4.0.x'
gem 'react_on_rails', '~> 11.3.0'
gem 'slim-rails'
gem 'iso-639'
gem 'countries'
gem 'font-awesome-rails'

# Gems specific to public archive app:
gem 'sunspot_rails'
gem 'unicode'
gem 'acts_as_taggable_on_steroids'
gem 'localized_country_select'
gem 'route_translator'
gem 'devise'
gem 'rack-maintenance'
gem 'celluloid'
gem 'sunspot_solr', '2.1.0' # A simple Solr installation with good defaults for development and testing.


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
  gem 'ruby-debug-ide'
  gem 'debase'
  gem "capistrano", "= 3.11.0"
  gem 'capistrano3-delayed-job', '~> 1.0'
  gem 'capistrano-rbenv'
  gem 'capistrano-rails'
  gem 'capistrano-passenger'
  gem 'puma'
  gem 'foreman'
  gem 'progress_bar'
  gem 'rb-readline'
  gem 'pry'
end

#
group :test do
  gem 'rspec'
  gem 'rspec-rails'
  # Faster tests:
  gem 'spork'
  #gem 'rest-client'
  #gem 'json'
  #gem 'pry'
  gem 'factory_bot'
  gem 'factory_bot_rails'
  gem 'rspec-activemodel-mocks'
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
