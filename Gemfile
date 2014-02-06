source 'https://dev.cedis.fu-berlin.de/geminabox/'
source 'http://rubygems.org'

ruby '1.8.7'

# Most version restrictions are due to rails 2.3 compat and may probably
# be removed when upgrading to 3.x.

gem 'rails', :git => 'git://github.com/makandra/rails.git', :branch => '2-3-lts'
gem 'rake'
gem 'mysql'
gem 'exception_notification', '~> 2.3.0'
gem 'workflow'
gem 'will_paginate', '~> 2.3'
gem 'paperclip',
    :git => 'git://github.com/jerico-dev/paperclip.git',
    :branch => 'v2.7'
gem 'mime-types', '~> 1.25' # Only required as long as we use ruby 1.8.
gem 'archive-shared'
gem 'archive-authorization'
gem 'archive-player'
gem 'globalize2',
    :git => 'git://github.com/jerico-dev/globalize2.git',
    :branch => 'master'
gem 'nokogiri', '~> 1.5.0' # Version 1.6 requires ruby 1.9.
gem 'resource_controller', :require => false, # Requiring resource_controller loads ApplicationController too early!
    :git => 'git://github.com/jerico-dev/resource_controller.git',
    :branch => 'master'
gem 'fastercsv'
gem 'open4'
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

gem 'rdoc', '~> 3.12.0' # required for our version of rubygems
gem 'rspec', '~> 1.3', :require => false
gem 'rspec-rails', '~> 1.3', :require => false

group :development do
  gem 'guard-spork'
  gem 'ruby-debug-ide'
  gem 'ruby-debug-base'
  gem 'capistrano'
  gem 'thin' # Required to test ZWAR in IE from a virtual machine (works around WebRick's reverse DNS lookup bug).
end

group :development, :test do
  gem 'sunspot_solr' # A simple Solr installation with good defaults for development and testing.
  gem 'guard-rspec'
  # Faster tests:
  gem 'spork', '~> 0.8.0'
end

group :test do
  # Fixtures replacement:
  gem 'factory_girl', '~> 2'
end
