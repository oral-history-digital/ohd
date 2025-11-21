source 'https://rubygems.org'

source "https://rubygems.org"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 8.0.2"
# The modern asset pipeline for Rails [https://github.com/rails/propshaft]
#gem "propshaft"
# Use JavaScript with ESM import maps [https://github.com/rails/importmap-rails]
gem "importmap-rails"
# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem "turbo-rails"
# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem "stimulus-rails"
# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder"

# use css-bundling
gem "cssbundling-rails"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Use the database-backed adapters for Rails.cache, Active Job, and Action Cable
gem "solid_cache"
gem "solid_queue"
gem "solid_cable"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Deploy this application anywhere as a Docker container [https://kamal-deploy.org]
gem "kamal", require: false

# Add HTTP asset caching/compression and X-Sendfile acceleration to Puma [https://github.com/basecamp/thruster/]
gem "thruster", require: false

gem 'mysql2', '~> 0.5.6'
gem "redis", "~> 4.0"
gem 'pundit'
gem 'workflow-activerecord', '~> 6.0'
gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'will_paginate', '~> 3.3.1'
gem 'mini_magick'
gem 'mini_exiftool'
gem 'image_processing', '~> 1.2'
gem 'mime-types'
gem 'globalize', '~> 7.0.0'
gem 'activemodel-serializers-xml'
gem 'nokogiri'
gem 'fastercsv'
gem 'csv', '~> 3.2.0'
gem 'roo', "~> 2.10.1"
gem 'henkei'
gem 'webvtt-ruby'
gem 'oai_repository', git: 'https://github.com/grgr/oai_repository'
gem 'delayed_job_active_record', '~> 4.1.8'
gem 'daemons'
gem 'open4'
gem 'cyrillizer'
gem 'active_model_serializers', '~> 0.10.13'
gem 'rails-latex'
gem 'react_on_rails', '~> 14.0.4'
gem 'slim-rails'
gem 'iso-639'
gem 'countries'
gem 'font-awesome-rails'
gem 'rack-brotli', '~> 2.0'
gem 'rack-cors'
gem 'sprockets-rails'
gem 'rexml', '~> 3.2.8'
gem 'base64', '~> 0.2.0'

# Gems specific to public archive app:
gem 'unicode'
gem 'acts_as_taggable_on_steroids'
gem 'devise'
gem 'doorkeeper', '~> 5.8.2'
gem 'doorkeeper-openid_connect', '~> 1.8.11'
gem 'activerecord-session_store'
gem 'rack-maintenance'
gem 'sunspot_rails', '~> 2.7.1'
gem 'sunspot_solr', '~> 2.7.1'
gem 'progress_bar'
gem 'shakapacker', '~> 8.0.2'


group :test, :development do
  gem "bundler-audit", "~> 0.9.1"
  gem "byebug", "~> 11.1"
  gem 'bcrypt_pbkdf'
  gem 'ed25519'
  gem 'pry'
end

group :development do
  # Automatic tests
  gem 'rails-erd'
  gem 'guard-spork'
  gem 'capistrano', '~> 3.17.3'
  gem 'capistrano3-delayed-job', '~> 1.0'
  gem 'capistrano-rbenv'
  gem 'capistrano-rails'
  gem 'capistrano-passenger'
  gem 'puma'
  gem 'rb-readline'
end

group :test do
  gem 'capybara'
  gem 'database_cleaner'
  gem 'minitest-retry'
  gem 'spork' # faster tests
  gem 'pdf-inspector', require: "pdf/inspector"
  gem 'pdf-reader'
  gem 'selenium-webdriver'
  gem 'simplecov'
end

group :production do
  gem 'execjs'
  gem 'uglifier'
end

#gem 'mini_racer', platforms: :ruby
gem 'mini_racer', '~> 0.16.0', platforms: :ruby


# TODO: ruby 2.7 fixes
gem 'net-http'
gem 'uri', '>= 0.13.1'
