source 'https://dev.cedis.fu-berlin.de/geminabox/'
source 'https://rubygems.org'

ruby '2.4.0'

gem 'rdoc'
gem 'rails', '~>5.0.0'
gem 'mysql2'
gem 'exception_notification'
gem 'workflow'
gem 'i18n-js'
gem 'i18n'
gem 'will_paginate'
gem 'rsolr'
gem 'paperclip'
gem 'acts-as-dag'
gem 'mime-types'
gem 'archive-shared'
gem 'archive-player'
gem 'globalize2'
gem 'nokogiri'
gem 'fastercsv'
gem 'open4'

# Gems specific to public archive app:
gem 'archive-authorization'
gem 'sunspot_rails'
gem 'unicode'
gem 'acts_as_taggable_on_steroids'
gem 'localized_country_select'
gem 'devise'
gem 'rack-maintenance'
gem 'celluloid'

group :development do
  # Automatic tests
  gem 'guard-spork'
  gem 'guard-rspec'
  gem 'guard-cucumber'
  gem 'ruby-debug-ide'
  #gem 'ruby-debug-base'
  gem 'capistrano'
  gem 'thin'
end

group :development, :test do
  gem 'sunspot_solr', '2.1.0' # A simple Solr installation with good defaults for development and testing.
  gem 'rspec'
  gem 'rspec-rails'
  # Faster tests:
  gem 'spork'
  gem 'rest-client'
  gem 'json'
end

group :test do
  # Fixtures replacement:
  gem 'factory_girl'
  # Integration tests:
  gem 'capybara'
  gem 'cucumber'
  gem 'cucumber-rails'
  gem 'selenium-webdriver'
  gem 'database_cleaner'
  gem 'email_spec'
end
