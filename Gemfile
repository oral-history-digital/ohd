source 'https://rubygems.org'

gem 'rdoc'
gem 'rails', '~> 7.0.8.1'
gem 'mysql2', '~> 0.5.6'
gem "redis", "~> 4.0"
gem 'pundit'
gem 'workflow'
gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'will_paginate', '~> 3.3.1'
gem 'mini_magick'
gem 'mini_exiftool'
gem 'image_processing', '~> 1.2'
gem 'mime-types'
gem 'globalize', '~> 6.2.1'
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
gem 'react_on_rails', '~> 13.4.0'
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
gem 'devise'
gem 'doorkeeper'
gem 'activerecord-session_store'
gem 'rack-maintenance'
gem 'sunspot_rails', '~> 2.6.0'
gem 'sunspot_solr', '~> 2.6.0'
gem 'progress_bar'
gem 'shakapacker', '7.2.3'


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
  gem 'capistrano', '~> 3.17.0'
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

gem 'mini_racer', platforms: :ruby

# TODO: ruby 2.7 fixes
gem 'net-http'
gem 'uri', '0.10.0'
