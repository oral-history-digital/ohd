source 'https://dev.cedis.fu-berlin.de/geminabox/'
source 'https://rubygems.org'

ruby '1.8.7'

# Most version restrictions are due to rails 2.3 compat and may probably
# be removed when upgrading to 3.x.

gem 'rdoc'
gem 'rails', :git => 'git://github.com/makandra/rails.git', :branch => '2-3-lts'
gem 'rake'
gem 'mysql'
gem 'exception_notification', '~> 2.3.0' # Version restriction for Rails 2.3.
gem 'workflow'
gem 'i18n-js'
gem 'i18n', '<= 0.6.11' # We rely on ruby 1.9-style string interpolation ('...%{something}...' % {:something => '...'}) which has been removed from i18n after this version.
gem 'will_paginate', '~> 2.3' # Version restriction for Rails 2.3.
gem 'paperclip',
    :git => 'git://github.com/jerico-dev/paperclip.git',
    :branch => 'v2.7' # Version restriction for Rails 2.3.
gem 'mime-types', '~> 1.25' # Only required as long as we use ruby 1.8.
gem 'archive-shared', '>= 0.0.6'
gem 'archive-player', '>= 0.2.7'
gem 'globalize2',
    :git => 'git://github.com/jerico-dev/globalize2.git',
    :branch => 'master'
gem 'nokogiri', '~> 1.5.0' # Version 1.6 requires ruby 1.9.
gem 'resource_controller', :require => false, # Requiring resource_controller loads ApplicationController too early!
    :git => 'git://github.com/jerico-dev/resource_controller.git',
    :branch => 'master'
gem 'fastercsv'
gem 'open4'

# Gems specific to public archive app:
gem 'archive-authorization'
gem 'sunspot_rails', '~> 2.0.0' # Version requirement can be dropped when upgrading to Rails 3.x
gem 'unicode'
gem 'acts_as_taggable_on_steroids',
    :git => 'git://github.com/jerico-dev/acts_as_taggable_on_steroids.git',
    :branch => 'master'
gem 'localized_country_select', '0.0.1'
gem 'warden', '0.10.7'
gem 'devise', '1.0.8'
gem 'smurf'
gem 'rack-maintenance'


group :development do
  # Automatic tests
  gem 'guard-spork'
  gem 'guard-rspec'
  gem 'guard-cucumber', '0.7.5' # Version restriction can be released when we upgrade cucumber to version 1.2.0 or later.
  gem 'ruby-debug-ide'
  gem 'ruby-debug-base'
  gem 'capistrano'
  gem 'thin' # Required to test the archive in IE from a virtual machine (works around WebRick's reverse DNS lookup bug).
end

group :development, :test do
  gem 'sunspot_solr' # A simple Solr installation with good defaults for development and testing.
  gem 'rspec', :require => 'spec' # The require-statement is needed for email_spec to work correctly.
  gem 'rspec-rails', :require => false
  # Faster tests:
  gem 'spork', '~> 0.8.0' # Version restriction for Rails 2.3.
  gem 'rest-client' # Required for access to Sauce's REST API.
  gem 'json' # Required for access to Sauce's REST API.
end

group :test do
  # Fixtures replacement:
  gem 'factory_girl', '~> 2' # Later versions require ruby 1.9.
  # Integration tests:
  gem 'capybara', '1.1.4' # Later versions require ruby 1.9.
  gem 'cucumber', '1.1.0' # Version restriction for Rails 2.3.
  gem 'cucumber-rails', '0.3.2', :require => false # Version restriction for Rails 2.3.
  gem 'selenium-webdriver', '2.35.1' # Later versions depend on rubyzip 1.0.0 which requires Ruby 1.9.
  gem 'database_cleaner', '<= 1.0.1' # Later versions break Rails 2.3
  gem 'email_spec', '0.6.6' # Version restriction for Rails 2.3.
end
