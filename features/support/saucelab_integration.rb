Before do
  if Capybara.current_driver == :sauce
    jobid = page.driver.browser.session_id
    puts("See results at <a href=\"http://saucelabs.com/jobs/#{jobid}\">SauceLab</a> page.")
  end
end
