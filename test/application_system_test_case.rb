require "test_helper"

Capybara.configure do |c|
  url = URI.parse(OHD_DOMAIN)

  c.server_host = url.host
  c.server_port = url.port

  # c.default_max_wait_time = 30
end

Selenium::WebDriver.logger.level = :error

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  if ENV['HEADLESS'] == 'true'
    driven_by :selenium, using: :headless_chrome, screen_size: [1400, 1400] do |options|
      options.add_argument('--disable-dev-shm-usage')
      options.add_argument('--no-sandbox')
      options.add_argument('--disable-gpu')
      
      # In CI, use Chromium instead of Chrome
      if ENV['CI'] == 'true'
        options.binary = '/usr/bin/chromium-browser'
      end
      
      # Enable browser logging to see JavaScript errors
      options.logging_prefs = { browser: 'ALL' }
    end
  else
    driven_by :selenium, using: :firefox, screen_size: [1400, 1400]
  end
  
  # Helper to wait for React to finish loading
  def wait_for_react
    # Wait for React DevTools message or a known React-mounted element
    has_css?('.Layout', wait: 10) # Wait up to 10 seconds for main layout
  end
  
  # Helper to print browser console logs
  def print_browser_logs
    if ENV['CI'] == 'true' && page.driver.browser.respond_to?(:logs)
      logs = page.driver.browser.logs.get(:browser)
      if logs.any?
        puts "\n========== Browser Console Logs =========="
        logs.each do |log|
          puts "[#{log.level}] #{log.message}"
        end
        puts "=========================================="
      else
        puts "\n[No browser console logs]"
      end
    end
  rescue => e
    puts "Could not retrieve browser logs: #{e.message}"
  end
  
  # Helper to print comprehensive page debug info
  def print_page_debug_info(label = "DEBUG")
    return unless ENV['CI'] == 'true'
    
    puts "\n" + "="*50
    puts "#{label} - Page Debug Info"
    puts "="*50
    puts "Current URL: #{current_url}"
    puts "Page title: #{page.title}"
    
    # Check for network errors by looking at the page source
    puts "\n--- Checking for asset load errors ---"
    if page.html.include?('Failed to load resource') || page.html.include?('404')
      puts "⚠️  WARNING: Page may have failed resource loads"
    else
      puts "✓ No obvious asset load errors in HTML"
    end
    
    puts "\n--- Script tags (first 10) ---"
    script_tags = page.all('script', visible: false)
    puts "Total script tags found: #{script_tags.length}"
    script_tags.first(10).each_with_index do |tag, i|
      src = tag[:src] || '(inline)'
      type = tag[:type] || 'text/javascript'
      puts "  #{i+1}. src=#{src}, type=#{type}"
    end
    
    puts "\n--- Link tags (CSS, first 5) ---"
    link_tags = page.all('link[rel="stylesheet"]', visible: false)
    puts "Total stylesheet links found: #{link_tags.length}"
    link_tags.first(5).each_with_index do |tag, i|
      puts "  #{i+1}. href=#{tag[:href]}"
    end
    
    puts "\n--- Body content (first 1000 chars) ---"
    body = page.find('body', visible: false)
    puts body.text[0..1000].gsub(/\s+/, ' ')
    
    puts "\n--- Looking for React root element ---"
    if page.has_css?('#app', visible: false)
      app_div = page.find('#app', visible: false)
      puts "✓ Found #app div"
      puts "  innerHTML length: #{app_div[:innerHTML]&.length || 0} chars"
      puts "  First 200 chars: #{app_div[:innerHTML][0..200]}" if app_div[:innerHTML]
    else
      puts "✗ No #app div found!"
    end
    
    print_browser_logs
    
    puts "="*50 + "\n"
  end
end
