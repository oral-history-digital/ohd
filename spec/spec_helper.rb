# This file is copied to ~/spec when you run 'ruby script/generate rspec'
# from the project root directory.

require 'spork'
#uncomment the following line to use spork with the debugger
#require 'spork/ext/ruby-debug'

# The Spork.prefork block is run only once when the spork server is started.
# You typically want to place most of your (slow) initializer code in here, in
# particular, require'ing any 3rd-party gems that you don't normally modify
# during development.
Spork.prefork do
  # Loading more in this block will cause your tests to run faster. However,
  # if you change any configuration or code from libraries loaded here, you'll
  # need to restart spork for it take effect.

  ENV['RAILS_ENV'] ||= 'test'
  require File.expand_path(File.join(File.dirname(__FILE__),'..','config','environment'))
  require 'spec/autorun'
  require 'spec/rails'

  # We use Steak (http://jeffkreeftmeijer.com/2010/steak-because-cucumber-is-for-vegetarians/)
  # for Capybara RSpec integration as Capybara does not support RSpec 1. When we switch to Rails 3.x
  # and RSpec 2 then we can remove Steak.
  # Once we got RSpec2 we can:
  # - require 'capybara/rspec' here
  # The feature spec DSL of RSpec2 is mostly compatible with Steak, that's why
  # we chose Steak and didn't roll our own integration. Please also see:
  # - http://stackoverflow.com/questions/4773096/what-does-steak-add-beyond-just-using-capybara-and-rspec-in-rails-testing
  # - http://stackoverflow.com/questions/5731684/setting-up-capybara-for-rails-2-3-and-rspec
  # Acceptance test support.
  require 'steak'
  require 'capybara/rails'

  test_strategy = (ENV['TEST_STRATEGY'] || :rack_test).to_sym
  case test_strategy
    when :sauce
      # Configure capybara for SauceLabs browsertests.
      Capybara.register_driver :sauce do |app|
        caps = Selenium::WebDriver::Remote::Capabilities.firefox
        caps.version = '26'
        caps.platform = 'Windows 7'
        caps[:name] = 'Testing Capybara'
        Capybara::Selenium::Driver.new(
            app,
            :browser => :remote,
            :url => 'http://jerico-dev:9f0edcb2-ac9c-46c6-9da9-290888bf1218@ondemand.saucelabs.com:80/wd/hub',
            :desired_capabilities => caps
        )
      end

    when :chrome
      # Configure capybara with local chromium.
      Capybara.register_driver :chrome do |app|
        Capybara::Selenium::Driver.new(app, :browser => :chrome)
      end

    else
      test_strategy = :rack_test
  end
  Capybara.default_driver = test_strategy

  Spec::Runner.configure do |config|
    # Set database cleaner strategy depending on test strategy.
    config.use_transactional_fixtures = false
    config.before(:suite) do
      cleaner_strategy = ([:chrome, :sauce].include?(test_strategy) ? :truncation : :transaction)
      DatabaseCleaner.strategy = cleaner_strategy
      DatabaseCleaner.clean_with(:truncation)
    end
    config.before(:each) do
      DatabaseCleaner.start
    end
    config.after(:each) do
      DatabaseCleaner.clean
    end

    # Make FactoryGirl's DSL available in RSpec so that we don't have
    # to type FactoryGirl.something() all the time.
    config.include FactoryGirl::Syntax::Methods

    # Make Capybara's DSL available to RSpec acceptance tests.
    config.include Capybara::DSL
  end

  # ZWAR apps shared spec helpers.
  require 'archive-shared/spec-support'
end

# The Spork.each_run block is run each time you run your specs.  In case you
# need to load files that tend to change during development, require them here.
# With Rails, your application modules are loaded automatically, so sometimes
# this block can remain empty.
#
# Note: You can modify files loaded *from* the Spork.each_run block without
# restarting the spork server.  However, this file itself will not be reloaded,
# so if you change any of the code inside the each_run block, you still need to
# restart the server.  In general, if you have non-trivial code in this file,
# it's advisable to move it into a separate file so you can easily edit it
# without restarting spork.  (For example, with RSpec, you could move
# non-trivial code into a file spec/support/my_helper.rb, making sure that the
# spec/support/* files are require'd from inside the each_run block.)
Spork.each_run do
  # This code will be run each time you run your specs.

  # Requires supporting files with custom matchers and macros, etc,
  # in ./support/ and its subdirectories.
  Dir[File.expand_path(File.join(File.dirname(__FILE__),'support','**','*.rb'))].each {|f| require f}

  # Put your acceptance spec helpers inside /spec/acceptance/support
  Dir["#{File.dirname(__FILE__)}/acceptance/support/**/*.rb"].each {|f| require f}

  if Spork.using_spork?
    # Reload factories.
    FactoryGirl.reload
  end
end

# Any code that is left outside the two Spork blocks will be run during preforking
# *and* during each_run -- that's probably not what you want.
