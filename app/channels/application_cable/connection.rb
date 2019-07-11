module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user_account
 
    def connect
      self.current_user_account = find_verified_user_account
    end
 
    private
      def find_verified_user_account
        if verified_user_account = env['warden'].user
          verified_user_account
        else
          reject_unauthorized_connection
        end
      end
  end
end
