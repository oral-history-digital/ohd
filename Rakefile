# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require(File.join(File.dirname(__FILE__), 'config', 'boot'))

require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

require 'tasks/rails'

# specify absolute path to local gem
require File.join(File.dirname(__FILE__), 'vendor/gems/sunspot_rails-0.11.5/lib/sunspot/rails/tasks')