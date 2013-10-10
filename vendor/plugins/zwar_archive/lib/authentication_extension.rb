require 'devise'

ActionController::Base.send :include, Devise::Controllers::ArchiveAuthenticationHelpers
