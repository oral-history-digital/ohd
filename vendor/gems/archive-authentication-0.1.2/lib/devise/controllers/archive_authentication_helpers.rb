module Devise

  module Controllers

    module ArchiveAuthenticationHelpers

      def self.included?(recipient)
        recipient.class_eval do
          helper_method :signed_in?, :current_user
        end
      end

      def authenticate_user
        warden.authenticate(:user)
      end

      def authenticate_user!
        warden.authenticate!(:user)
      end

      def user_signed_in?
        user_account_signed_in?
      end

      def current_user
        current_user_account and current_user_account.user
      end

      def user_session
        user_account_session
      end

    end

  end

end