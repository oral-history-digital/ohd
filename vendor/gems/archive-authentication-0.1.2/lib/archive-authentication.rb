begin
  require 'devise'
rescue
  gem 'devise', '1.0.7'
  require 'devise'
end

ActiveRecord::Base.send(:include, Devise::ArchiveModelExtensions::ActiveRecordExtension)
User.send(:include, Devise::ArchiveModelExtensions::UserExtension)
ActionController::Base.send(:include, Devise::Controllers::ArchiveAuthenticationHelpers)