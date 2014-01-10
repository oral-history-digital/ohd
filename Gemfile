source 'https://dev.cedis.fu-berlin.de/geminabox/'
source 'https://rubygems.org'

ruby '1.8.7'

# Most version restrictions are due to rails 2.3 compat and may probably
# be removed when upgrading to 3.x.

gem 'rails', '~> 2.3'
gem 'rake'
gem 'mysql'
gem 'exception_notification', '~> 2.3.0'
gem 'workflow'
gem 'will_paginate', '~> 2.3'
gem 'paperclip', '~> 2.7.5'
gem 'archive-authentication'
gem 'archive-authorization'
gem 'archive-player'
gem 'nokogiri', '~> 1.5.0' # Version 1.6 requires ruby 1.9.
gem 'resource_controller', :require => false, # Requiring resource_controller loads ApplicationController too early!
    :git => 'git://github.com/jerico-dev/resource_controller.git',
    :branch => 'master'
gem 'fastercsv'
gem 'open4'
gem 'rsolr', '~> 0.9.7'
gem 'rsolr-ext', '~> 0.9.6'
gem 'escape'
gem 'daemons' # for sunspot
gem 'sunspot' , '0.10.8'
gem 'sunspot_rails', '0.11.5', :require => 'sunspot/rails'
gem 'unicode'
gem 'acts_as_taggable_on_steroids',
    :git => 'git://github.com/jerico-dev/acts_as_taggable_on_steroids.git',
    :branch => 'master'
gem 'localized_country_select', '0.0.1'
gem 'warden', '0.10.7'
gem 'devise', '1.0.8'
gem 'smurf'
gem 'rack-maintenance'

gem 'rdoc', '~> 3.12.0' # required for our version of rubygems
gem 'rspec', '~> 1.3', :require => false
gem 'rspec-rails', '~> 1.3', :require => false

group :development do
  gem 'guard-spork'
  gem 'ruby-debug-ide'
  gem 'ruby-debug-base'
  gem 'capistrano'
end

group :development, :test do
  gem 'guard-rspec'
  # Faster tests:
  gem 'spork', '~> 0.8.0'
end

