#source 'https://dev.cedis.fu-berlin.de/geminabox/'
source 'https://rubygems.org'

ruby '2.4.0'

gem 'rdoc'
gem 'rails', '~>5.0.0'
gem 'mysql2'
gem 'exception_notification'
gem 'workflow'
gem 'i18n-js'
gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'i18n'
gem 'will_paginate'
gem 'rsolr'
gem 'paperclip'
gem 'acts-as-dag', git: 'https://github.com/grgr/acts-as-dag'
gem 'mime-types'
gem 'globalize', git: 'https://github.com/globalize/globalize'
gem 'activemodel-serializers-xml'
gem 'nokogiri'
gem 'fastercsv'
gem 'open4'
gem 'cyrillizer'
gem 'active_model_serializers', '~> 0.10.0'

gem 'sass-rails'
#gem 'webpacker'
gem 'react-rails'
#gem 'foreman'
gem 'slim-rails'

# Gems specific to public archive app:
gem 'sunspot_rails'
gem 'unicode'
gem 'acts_as_taggable_on_steroids'
gem 'localized_country_select'
gem 'route_translator'
gem 'devise'
gem 'rack-maintenance'
gem 'celluloid'

group :development do
  # Automatic tests
  gem 'rails-erd'
  gem 'guard-spork'
  gem 'guard-rspec'
  gem 'guard-cucumber'
  gem 'ruby-debug-ide'
  gem 'debase'
  gem "capistrano", "~> 3.9"
  gem 'capistrano-rbenv'
  gem 'capistrano-rails'
  gem 'capistrano-passenger'
  gem 'thin'
  gem 'webpacker'
  gem 'foreman'
end

group :development, :test do
  gem 'sunspot_solr', '2.1.0' # A simple Solr installation with good defaults for development and testing.
  gem 'rspec'
  gem 'rspec-rails'
  # Faster tests:
  gem 'spork'
  gem 'rest-client'
  gem 'json'
  gem 'pry'
end

group :test do
  # Fixtures replacement:
  gem 'factory_girl'
  gem 'factory_girl_rails'
  gem 'rspec-activemodel-mocks'
  # Integration tests:
  gem 'capybara'
  gem 'cucumber'
  gem 'cucumber-rails'
  gem 'selenium-webdriver'
  gem 'database_cleaner'
  gem 'email_spec'
end

group :production do
  gem 'execjs'
  gem 'therubyracer', :platforms => :ruby
end
