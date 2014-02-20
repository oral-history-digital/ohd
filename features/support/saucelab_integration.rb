Around do |scenario, block|
  Sauce::CucumberCapybara.around_hook(scenario, block) if Capybara.current_driver == :sauce
end

module Sauce

  BROWSERS = {
      :IE9 => {:browser => 'internet_explorer', :version => '9', :platform => 'Windows 7'},
      :IE10 => {:browser => 'internet_explorer', :version => '10', :platform => 'Windows 7'},
      :IE11 => {:browser => 'internet_explorer', :version => '11', :platform => 'Windows 8.1'},
      :FF => {:browser => 'firefox', :version => '26', :platform => 'Windows 7'},
      :CR => {:browser => 'chrome', :version => nil, :platform => 'Windows 7'},
  }

  DEFAULT_BROWSER = :IE10

  def self.get_credentials
    [ENV['SAUCE_USERNAME'], ENV['SAUCE_ACCESS_KEY']]
  end

  # This is an adapted version of Sauce's cucumber/capybara integration, see
  # https://github.com/saucelabs/sauce_ruby/blob/master/gems/sauce-cucumber/lib/sauce/cucumber.rb.
  module CucumberCapybara

    class << self

      def around_hook(scenario, block)
        # Which browser/platform to test?
        browser = (ENV['SAUCE_BROWSER'] || Sauce::DEFAULT_BROWSER).to_sym
        browser = Sauce::DEFAULT_BROWSER unless Sauce::BROWSERS.keys.include? browser
        browser_config = Sauce::BROWSERS[browser]

        # Configure capybara for SauceLabs browser tests.
        configure_capybara(browser, browser_config, scenario)

        # Run the scenario.
        block.call

        # Retrieve the job id (aka selenium session id)
        # before resetting the driver.
        job_id = Capybara.current_session.driver.browser.session_id

        # Quit the driver to allow for the generation of a new session id
        # and a new job name.
        reset_capybara

        # Update the job status with the scenario status.
        RestAPI::Jobs.update_fields job_id, 'passed' => !scenario.failed?

        # Download and persist job assets.
        download_job_assets(job_id, scenario, browser_config)
      end

      private

      def scenario_name(scenario)
        if scenario.instance_of? ::Cucumber::Ast::OutlineTable::ExampleRow
          table = scenario.instance_variable_get(:@table)
          outline = table.instance_variable_get(:@scenario_outline)
          "#{outline.feature.file} - #{outline.title} - #{table.headers} -> #{scenario.name}"
        else
          scenario_name = scenario.name.split("\n").first
          feature_name = scenario.feature.short_name
          "#{feature_name} - #{scenario_name}"
        end
      end

      def platform_name(browser_config)
        "#{browser_config[:browser].capitalize} #{browser_config[:version]} - #{browser_config[:platform]}"
      end

      def name_from_scenario_and_platform(scenario, browser_config)
        "#{scenario_name(scenario)} [#{platform_name(browser_config)}]"
      end

      def asset_dir_from_scenario_and_platform(scenario, browser_config)
        scenario_dir = scenario_name(scenario).gsub(/ ->? /, '_').gsub(/\s+/, '_')
        platform_dir = platform_name(browser_config).gsub(' - ', '_').gsub(/\s+/, '_')
        File.join(Rails.root, 'tmp', 'test_results', scenario_dir.downcase, platform_dir.downcase, Time.now.strftime('%Y%m%d-%H%M%S'))
      end

      def configure_capybara(browser, browser_config, scenario)
        driver_name = "sauce-#{browser.to_s.downcase}".to_sym
        Capybara.register_driver driver_name do |app|
          caps = Selenium::WebDriver::Remote::Capabilities.send(browser_config[:browser])
          caps.version = browser_config[:version]
          caps.platform = browser_config[:platform]
          caps[:name] = name_from_scenario_and_platform(scenario, browser_config)
          sauce_user, sauce_accesskey = Sauce.get_credentials
          Capybara::Selenium::Driver.new(
              app,
              :browser => :remote,
              :url => "http://#{sauce_user}:#{sauce_accesskey}@ondemand.saucelabs.com:80/wd/hub",
              :desired_capabilities => caps
          )
        end
        Capybara.current_driver = driver_name
        Capybara.javascript_driver = driver_name
        Capybara.default_driver = driver_name

        # Only certain ports are allowed by SauceLabs, see "Accessing applications
        # on localhost" at https://saucelabs.com/docs/connect.
        Capybara.server_port = 9000
      end

      def reset_capybara
        # Quit the capybara session.
        # NB: This automatically stops the job on Sauce's side.
        Capybara.current_session.driver.quit
        Capybara.drivers[Capybara.current_driver] = nil
        Capybara.clear_session_pool

        # Set the driver name to a browser-neutral name.
        Capybara.current_driver = :sauce
        Capybara.javascript_driver = :sauce
        Capybara.default_driver = :sauce
      end

      def download_job_assets(job_id, scenario, browser_config)
        job_dir = asset_dir_from_scenario_and_platform(scenario, browser_config)
        FileUtils.mkdir_p job_dir

        # Save a file with the job id.
        File.open(File.join(job_dir, 'job-link.txt'), 'w+') do |file|
          file.write "http://saucelabs.com/jobs/#{job_id}"
        end

        # Save screenshots and other assets.
        asset_list = RestAPI::Assets.list(job_id)
        asset_list.each do |asset_type, asset_names|

          if asset_names.is_a? Array
            asset_dir = File.join(job_dir, asset_type)
            FileUtils.mkdir asset_dir
          else
            asset_dir = job_dir
          end

          asset_names.each do |asset_name|
            target_file = File.join(asset_dir, asset_name)
            File.open(target_file, 'w+') do |file|
              file.write(RestAPI::Assets.fetch(job_id, asset_name))
            end
          end

        end
      end

    end

  end

  module RestAPI

    require 'rest-client'
    require 'json'

    # Inspired by Sauce's sauce_whisk Gem, see https://github.com/saucelabs/sauce_whisk
    # NB: sauce_whisk requires ruby 1.9 so we cannot use it directly.
    module RequestBuilder

      GET_RETRIES = 15

      def base_url
        'https://saucelabs.com/rest/v1'
      end

      def auth_details
        sauce_user, sauce_accesskey = Sauce.get_credentials
        {:user => sauce_user, :password => sauce_accesskey}
      end

      def fully_qualified_resource
        (respond_to? :resource) ? "#{base_url}/#{resource}" : base_url
      end

      def get(resource_to_fetch=nil)
        resource_url = fully_qualified_resource
        resource_url << "/#{resource_to_fetch}" if resource_to_fetch
        RestClient::Request.execute({:method => :get, :url => resource_url}.merge auth_details)
      end

      def get_with_retry(resource_to_fetch=nil, catch_error = RestClient::Exception)
        attempts ||= 1
        return get resource_to_fetch
      rescue catch_error => e
        if attempts <= GET_RETRIES
          attempts += 1
          sleep(2)
          retry
        else
          raise e
        end
      end

      def put(resource_id, body={})
        url = "#{fully_qualified_resource}/#{resource_id}"
        length = body.length
        headers = { 'Content-Length' => length }
        req_params = {
            :method => :put,
            :url => url,
            :payload => body,
            :content_type => 'application/json',
            :headers => headers
        }
        RestClient::Request.execute(req_params.merge auth_details)
      end

      def delete(resource_id)
        resource_to_delete = fully_qualified_resource << "/#{resource_id}"
        RestClient::Request.execute({:method => :delete, :url => resource_to_delete}.merge auth_details)
      end

      def post(opts)
        payload = (opts[:payload].to_json)
        resource_id = opts[:resource] || nil

        url = fully_qualified_resource
        url << "/#{resource_id}" if resource_id

        length = payload.length
        headers = { 'Content-Length' => length }
        req_params = {
            :method => :post,
            :url => url,
            :content_type => 'application/json',
            :headers => headers
        }
        req_params.merge!({:payload => payload}) unless payload.nil?

        RestClient::Request.execute(req_params.merge auth_details)
      end

    end

    module Jobs
      extend RequestBuilder

      class << self

        def resource
          "#{Sauce.get_credentials.first}/jobs"
        end

        def update_fields(job_id, fields_to_save)
          put job_id, fields_to_save.to_json
        end

      end

    end

    module Assets
      extend RequestBuilder

      class << self

        def resource
          "#{Sauce.get_credentials.first}/jobs"
        end

        def list(job_id)
          JSON.parse(get_with_retry("#{job_id}/assets", RestClient::BadRequest))
        end

        def fetch(job_id, asset)
          get_with_retry("#{job_id}/assets/#{asset}", RestClient::ResourceNotFound)
        end

      end

    end

  end

end

# Monkey patch capybara to make it work with one
# Sauce job (aka session and driver) per feature.
module Capybara

  class << self
    # Remove all capybara sessions so that they'll not be
    # re-used after we already quit them.
    def clear_session_pool
      @session_pool = {}
    end
  end

  class Selenium::Driver
    # Make sure that capybara's cucumber integration doesn't try
    # to close a session that we already quit.
    def quit_with_sauce
      # Only quit if we haven't already done so before.
      return if @already_quit
      @already_quit = true
      quit_without_sauce
    end
    alias_method_chain :quit, :sauce
  end

end
