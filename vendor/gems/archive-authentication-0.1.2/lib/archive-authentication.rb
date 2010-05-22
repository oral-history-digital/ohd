begin
  require 'devise'
rescue
  gem 'devise', '1.0.7'
  require 'devise'
end